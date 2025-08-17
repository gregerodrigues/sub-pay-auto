// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import {Script} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Currency, CurrencyLibrary} from "@uniswap/v4-core/src/types/Currency.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {DonateHelper} from "../src/DonateHelper.sol";
import {IHooks} from "@uniswap/v4-core/src/interfaces/IHooks.sol";
// Safe callback + settler helper (OZ uniswap-hooks utils)

contract DonateFeesScript is Script {
    // --- fill me ---
    address constant POOL_MANAGER = 0x00B036B58a818B1BC34d502D3fE730Db729e62AC;
    address constant USDC        = 0x31d0220469e10c4E71834a79b1f276d740d3768F;
    address constant WETH        = 0x4200000000000000000000000000000000000006;
    address constant HOOK = 0xC7E2a9498846dD2eD07a135a01c2bc51ae920040;


    uint24 constant FEE = 3000;
    int24  constant SPACING = 60;

    function run() external {
        vm.startBroadcast();

        DonateHelper helper = new DonateHelper(IPoolManager(POOL_MANAGER));

PoolKey memory key = PoolKey({
  currency0: Currency.wrap(USDC),
  currency1: Currency.wrap(WETH),
  fee: FEE,
  tickSpacing: SPACING,
  hooks: IHooks(0xC7E2a9498846dD2eD07a135a01c2bc51ae920040)   // <-- cast your address to IHooks here
});

        // Approve helper to pull your tokens for donation
        IERC20(USDC).approve(address(helper), type(uint256).max);
        IERC20(WETH).approve(address(helper), type(uint256).max);

        // Donate a tiny amount of each side to simulate fees (e.g., 1 USDC + 0 WETH)
        helper.donate(key, 1e6, 0, "");

        vm.stopBroadcast();
    }
}
