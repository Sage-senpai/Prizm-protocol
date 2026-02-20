// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Mock USD Coin (6-decimal stablecoin) for Prizm Protocol
 * @dev Mirrors the real USDC interface including 6-decimal precision.
 *      Faucet available for testnet judges.
 */
contract MockUSDC is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 10_000 * 10 ** 6; // 10 000 USDC

    event Faucet(address indexed recipient, uint256 amount);

    constructor() ERC20("USD Coin", "USDC") Ownable(msg.sender) {
        // Pre-mint 10 million USDC to deployer for vault liquidity
        _mint(msg.sender, 10_000_000 * 10 ** 6);
    }

    /// @notice Override to return 6 decimals matching real USDC
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Owner mint for vault funding
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Open faucet – any caller receives FAUCET_AMOUNT USDC
     */
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
        emit Faucet(msg.sender, FAUCET_AMOUNT);
    }
}
