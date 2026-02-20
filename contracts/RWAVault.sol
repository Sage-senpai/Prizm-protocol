// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PoPRiskEngine.sol";

/**
 * @title RWAVault
 * @notice Proof-of-Personhood–weighted RWA lending vault for Prizm Protocol.
 *
 * Core mechanics
 * ──────────────
 *  • Users supply MockRWAToken (18 dec) as collateral.
 *  • Users borrow MockUSDC (6 dec) up to a PoP-weighted LTV.
 *  • Health Factor = (collateral_usd × liqThreshold%) / debt_usd
 *    If HF < 1.0 (scaled to 1e18) the position is liquidatable.
 *  • Borrowing is gated: PoP tier ≥ 1 is mandatory (anti-Sybil).
 *  • A mock price oracle (`collateralPrice`) is set by the owner;
 *    replace with Chainlink / Acurast in production.
 *
 * PoP borrow multiplier
 * ─────────────────────
 *  Tier 1 (DIM1) → 1.00× of collateral LTV allowance
 *  Tier 2 (DIM2) → 1.50× of collateral LTV allowance
 *  Tier 3 (Full) → 2.00× of collateral LTV allowance
 *
 * Deployed on Moonbase Alpha (chain ID 1287) for the Polkadot Solidity hackathon.
 */
contract RWAVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Constants ────────────────────────────────────────────────────────────
    uint256 public constant PRECISION           = 1e18;
    uint256 public constant BASE_LTV            = 65;   // 65 %
    uint256 public constant LIQUIDATION_THRESHOLD = 80; // 80 %
    uint256 public constant LIQUIDATION_BONUS   = 5;    //  5 % bonus to liquidator

    // ─── Immutables ───────────────────────────────────────────────────────────
    IERC20         public immutable collateralToken; // RWA (18 dec)
    IERC20         public immutable borrowToken;     // USDC (6 dec)
    PoPRiskEngine  public          popRiskEngine;

    // ─── Mutable state ────────────────────────────────────────────────────────
    /// @notice USDC price per 1 whole RWA token (6-decimal USDC units)
    /// @dev    Default: $1 000 per token.  Owner updates to simulate oracle.
    uint256 public collateralPrice = 1_000e6;

    uint256 public supplyRateBps = 680;  // 6.80 % APY (display only in this demo)
    uint256 public borrowRateBps = 920;  // 9.20 % APY (display only in this demo)

    uint256 public totalSupplied;
    uint256 public totalBorrowed;

    struct Position {
        uint256 supplied;   // RWA tokens (18 dec)
        uint256 borrowed;   // USDC (6 dec)
        uint256 lastUpdate; // timestamp (for future interest accrual)
    }

    mapping(address => Position) public positions;

    // ─── Events ───────────────────────────────────────────────────────────────
    event Supplied(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(
        address indexed user,
        address indexed liquidator,
        uint256 debtRepaid,
        uint256 collateralSeized
    );
    event PriceUpdated(uint256 oldPrice, uint256 newPrice);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(
        address _collateralToken,
        address _borrowToken,
        address _popRiskEngine
    ) Ownable(msg.sender) {
        require(_collateralToken != address(0), "Zero collateral");
        require(_borrowToken     != address(0), "Zero borrow");
        require(_popRiskEngine   != address(0), "Zero engine");

        collateralToken = IERC20(_collateralToken);
        borrowToken     = IERC20(_borrowToken);
        popRiskEngine   = PoPRiskEngine(_popRiskEngine);
    }

    // ─── Core: supply / withdraw ──────────────────────────────────────────────

    /**
     * @notice Deposit RWA tokens as collateral.
     * @param amount Amount of RWA tokens (18 dec) to deposit.
     */
    function supply(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount zero");
        collateralToken.safeTransferFrom(msg.sender, address(this), amount);

        positions[msg.sender].supplied   += amount;
        positions[msg.sender].lastUpdate  = block.timestamp;
        totalSupplied                    += amount;

        emit Supplied(msg.sender, amount);
    }

    /**
     * @notice Withdraw collateral, subject to health factor constraints.
     * @param amount Amount of RWA tokens (18 dec) to withdraw.
     */
    function withdraw(uint256 amount) external nonReentrant {
        Position storage pos = positions[msg.sender];
        require(amount > 0 && amount <= pos.supplied, "Invalid amount");

        if (pos.borrowed > 0) {
            uint256 hfAfter = _healthFactor(pos.supplied - amount, pos.borrowed);
            require(hfAfter >= PRECISION, "Would cause liquidation");
        }

        pos.supplied  -= amount;
        totalSupplied -= amount;
        collateralToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    // ─── Core: borrow / repay ─────────────────────────────────────────────────

    /**
     * @notice Borrow USDC against supplied collateral.
     * @dev    Requires PoP tier ≥ 1.  Borrow limit is LTV × PoP multiplier.
     * @param amount USDC amount to borrow (6 dec).
     */
    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount zero");
        require(popRiskEngine.isVerified(msg.sender), "PoP verification required");

        Position storage pos = positions[msg.sender];
        require(pos.supplied > 0, "No collateral");

        uint256 maxBorrow = _maxBorrow(msg.sender);
        require(pos.borrowed + amount <= maxBorrow, "Exceeds PoP borrow limit");

        uint256 hf = _healthFactor(pos.supplied, pos.borrowed + amount);
        require(hf >= PRECISION, "Insufficient collateral");

        pos.borrowed     += amount;
        pos.lastUpdate    = block.timestamp;
        totalBorrowed    += amount;

        borrowToken.safeTransfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    /**
     * @notice Repay outstanding USDC debt.
     * @param amount USDC amount to repay (6 dec).
     */
    function repay(uint256 amount) external nonReentrant {
        Position storage pos = positions[msg.sender];
        require(amount > 0 && amount <= pos.borrowed, "Invalid repay amount");

        borrowToken.safeTransferFrom(msg.sender, address(this), amount);

        pos.borrowed  -= amount;
        totalBorrowed -= amount;

        emit Repaid(msg.sender, amount);
    }

    // ─── Liquidation ──────────────────────────────────────────────────────────

    /**
     * @notice Liquidate an undercollateralised position.
     * @param user        Address of the borrower to liquidate.
     * @param debtToCover USDC amount the liquidator will repay (6 dec).
     */
    function liquidate(address user, uint256 debtToCover) external nonReentrant {
        Position storage pos = positions[user];
        require(pos.borrowed > 0, "No debt");

        uint256 hf = _healthFactor(pos.supplied, pos.borrowed);
        require(hf < PRECISION, "Position healthy");
        require(debtToCover <= pos.borrowed, "Exceeds debt");

        uint256 collateralToSeize = _debtToCollateral(debtToCover);
        uint256 withBonus         = collateralToSeize * (100 + LIQUIDATION_BONUS) / 100;
        require(withBonus <= pos.supplied, "Insufficient collateral to seize");

        borrowToken.safeTransferFrom(msg.sender, address(this), debtToCover);

        pos.borrowed  -= debtToCover;
        pos.supplied  -= withBonus;
        totalBorrowed -= debtToCover;
        totalSupplied -= withBonus;

        collateralToken.safeTransfer(msg.sender, withBonus);

        emit Liquidated(user, msg.sender, debtToCover, withBonus);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /**
     * @notice Full position summary for a user.
     * @return supplied       Collateral balance (18 dec)
     * @return borrowed       Debt balance (6 dec)
     * @return healthFactor   Scaled by 1e18 (< 1e18 = liquidatable)
     * @return maxBorrow      Max additional USDC borrow (6 dec)
     * @return popTier        Current PoP tier (0-3)
     */
    function getPosition(address user)
        external
        view
        returns (
            uint256 supplied,
            uint256 borrowed,
            uint256 healthFactor,
            uint256 maxBorrow,
            uint8   popTier
        )
    {
        Position storage pos = positions[user];
        supplied     = pos.supplied;
        borrowed     = pos.borrowed;
        healthFactor = pos.borrowed > 0
            ? _healthFactor(pos.supplied, pos.borrowed)
            : type(uint256).max;
        maxBorrow    = _maxBorrow(user);
        (, , popTier) = _tierInfo(user);
    }

    /// @notice Pool utilisation = totalBorrowed / totalSupplied_usd × 100
    function getUtilization() external view returns (uint256) {
        uint256 supplyUsd = _collateralToUsd(totalSupplied);
        if (supplyUsd == 0) return 0;
        uint256 borrowUsd = totalBorrowed; // already in USDC
        return (borrowUsd * 100) / supplyUsd;
    }

    /// @notice Collateral USD value for a given amount of RWA tokens
    function collateralValueUsd(uint256 amount) external view returns (uint256) {
        return _collateralToUsd(amount);
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    /// @dev collateral (18 dec) → USDC value (6 dec)
    function _collateralToUsd(uint256 amount) internal view returns (uint256) {
        return (amount * collateralPrice) / 1e18;
    }

    /// @dev USDC (6 dec) → collateral amount (18 dec) at current price
    function _debtToCollateral(uint256 usdcAmount) internal view returns (uint256) {
        return (usdcAmount * 1e18) / collateralPrice;
    }

    /**
     * @dev Health Factor = (collateralUsd × liqThreshold%) / borrowedUsd, scaled 1e18
     */
    function _healthFactor(uint256 supplied, uint256 borrowed) internal view returns (uint256) {
        if (borrowed == 0) return type(uint256).max;
        uint256 collateralUsd = _collateralToUsd(supplied);
        uint256 weighted      = (collateralUsd * LIQUIDATION_THRESHOLD) / 100;
        return (weighted * PRECISION) / borrowed;
    }

    /**
     * @dev Max USDC borrow = collateralUsd × BASE_LTV% × popMultiplier / 100
     *      Returns 0 if user is not PoP-verified.
     */
    function _maxBorrow(address user) internal view returns (uint256) {
        uint256 multiplier = popRiskEngine.getBorrowMultiplier(user); // basis points
        if (multiplier == 0) return 0;

        Position storage pos = positions[user];
        uint256 collateralUsd = _collateralToUsd(pos.supplied);
        uint256 baseBorrow    = (collateralUsd * BASE_LTV) / 100;
        return (baseBorrow * multiplier) / 100;
    }

    function _tierInfo(address user) internal view returns (uint256 multiplier, uint256 cap, uint8 tier) {
        (tier, multiplier, cap) = popRiskEngine.getTierInfo(user);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /// @notice Update mock oracle price (owner only)
    function setCollateralPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Zero price");
        emit PriceUpdated(collateralPrice, newPrice);
        collateralPrice = newPrice;
    }

    /// @notice Seed the vault with USDC liquidity so borrows are possible
    function fundVault(uint256 amount) external onlyOwner {
        borrowToken.safeTransferFrom(msg.sender, address(this), amount);
    }

    /// @notice Update display APY rates (basis points)
    function setRates(uint256 supply_, uint256 borrow_) external onlyOwner {
        supplyRateBps = supply_;
        borrowRateBps = borrow_;
    }

    /// @notice Update the risk engine (e.g. after upgrade)
    function updateRiskEngine(address newEngine) external onlyOwner {
        require(newEngine != address(0), "Zero address");
        popRiskEngine = PoPRiskEngine(newEngine);
    }
}
