// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {IPositionManager} from "@uniswap/v4-periphery/src/interfaces/IPositionManager.sol";
import {IPermit2} from "permit2/src/interfaces/IPermit2.sol";

/// @notice Shared configuration between scripts (Unichain Sepolia)
contract BaseScript is Script {
    // === Core addresses (Unichain Sepolia) ===
    // Permit2 is chain-agnostic
    // IPermit2         public immutable permit2         = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);
    // IPoolManager     public immutable poolManager     = IPoolManager(0x00B036B58a818B1BC34d502D3fE730Db729e62AC);
    // IPositionManager public immutable positionManager = IPositionManager(payable(0xf969Aee60879C54bAAed9F3eD26147Db216Fd664));   // ✅ checksummed
 
   // === Core addresses ( Sepolia) ===
    IPermit2   public immutable permit2         = IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);
    IPoolManager     public immutable poolManager     = IPoolManager(0xE03A1074c86CFeDd5C142C4F04F1a1536e203543);
    IPositionManager public immutable positionManager = IPositionManager(payable(0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4));   // ✅ checksummed


    // Deployer (the EOA you run the script with)
    address public immutable deployerAddress;

    // === Tokens (USDC / WETH on Unichain Sepolia) ===
    // IERC20 public constant token0 = IERC20(0x31d0220469e10c4E71834a79b1f276d740d3768F); // USDC (6d)
    // IERC20 public constant token1 = IERC20(0x4200000000000000000000000000000000000006); // WETH9 (18d)

 // === Tokens ( PYUSD and WTH Sepolia) ===
    IERC20 public constant token0 = IERC20(0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9); // USDC (6d)
    IERC20 public constant token1 = IERC20(0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9); // WETH9 (18d)


    // Hook (set to address(0) while debugging; replace with your mined hook address later)
    IHooks  public constant hookContract = IHooks(0xC7E2a9498846dD2eD07a135a01c2bc51ae920040);

    // Currencies (sorted by address as required by v4)
    Currency public immutable currency0;
    Currency public immutable currency1;

    constructor() {
        deployerAddress = _getDeployer();
        (currency0, currency1) = _sortedCurrencies();

        // nice labels in traces
        vm.label(deployerAddress, "Deployer");
        vm.label(address(permit2), "Permit2");
        vm.label(address(poolManager), "PoolManager");
        vm.label(address(positionManager), "PositionManager");
        vm.label(address(token0), "Token0_USDC");
        vm.label(address(token1), "Token1_WETH");
        vm.label(address(hookContract), "HookContract");
    }

    /// @dev Sort tokens by address: currency0 must be the lower address
    function _sortedCurrencies() internal pure returns (Currency, Currency) {
        address a = address(token0);
        address b = address(token1);
        require(a != b, "token0 == token1");
        if (a < b) {
            return (Currency.wrap(a), Currency.wrap(b));
        } else {
            return (Currency.wrap(b), Currency.wrap(a));
        }
    }

    /// @dev First wallet from foundry’s ephemeral list (works with --private-key too)
    function _getDeployer() internal returns (address) {
        address[] memory wallets = vm.getWallets();
        require(wallets.length > 0, "No wallets found");
        return wallets[0];
    }
}
