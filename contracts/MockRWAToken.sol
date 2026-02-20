// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockRWAToken
 * @notice Mock ERC-20 representing tokenised Real World Asset collateral
 * @dev Deployed on Moonbase Alpha (Moonbeam testnet) for Prizm Protocol hackathon demo.
 *      Has an open faucet so judges can obtain collateral without friction.
 */
contract MockRWAToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1_000 * 10 ** 18; // 1 000 tokens

    event Faucet(address indexed recipient, uint256 amount);

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        Ownable(msg.sender)
    {
        // Pre-mint 1 million tokens to deployer for vault seeding / liquidity
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    /**
     * @notice Owner-only mint (for seeding additional liquidity)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Open faucet – any caller receives FAUCET_AMOUNT tokens
     * @dev Intentionally permissionless for testnet demo purposes
     */
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
        emit Faucet(msg.sender, FAUCET_AMOUNT);
    }
}
