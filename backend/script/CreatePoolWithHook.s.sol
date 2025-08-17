// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.26;

// import {console2} from "forge-std/Script.sol";
// import {IERC20} from "forge-std/interfaces/IERC20.sol";

// import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
// import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
// import {LiquidityAmounts} from "@uniswap/v4-core/test/utils/LiquidityAmounts.sol";
// import {TickMath} from "@uniswap/v4-core/src/libraries/TickMath.sol";

// import {BaseScript} from "./base/BaseScript.sol";
// import {LiquidityHelpers} from "./base/LiquidityHelpers.sol";

// contract CreatePoolWithHook is BaseScript, LiquidityHelpers {
//     uint24 lpFee = 3000;        // 0.30%
//     int24  tickSpacing = 60;

//     // ~2,500 USDC/ETH => sqrt(2500)=50 => 50 << 96
//     uint160 startingPrice = uint160(50) << 96;

//     // example deposit (adjust to your balance)
//     uint256 public token0Amount = 0.002e18; // native ETH (18d)
//     uint256 public token1Amount = 5e6;      // USDC (6d)

//     int24 tickLower;
//     int24 tickUpper;

//     function run() external {
//         // Build the PoolKey from BaseScript (currency0=native, currency1=USDC, hooks=hookContract)
//         PoolKey memory poolKey = PoolKey({
//             currency0: currency0,
//             currency1: currency1,
//             fee: lpFee,
//             tickSpacing: tickSpacing,
//             hooks: hookContract
//         });

//         bytes memory hookData = new bytes(0);

//         // Center the range around startingPrice
//         int24 currentTick = TickMath.getTickAtSqrtPrice(startingPrice);
//         tickLower = ((currentTick - 750 * tickSpacing) / tickSpacing) * tickSpacing;
//         tickUpper = ((currentTick + 750 * tickSpacing) / tickSpacing) * tickSpacing;

//         // Convert token amounts to liquidity
//         uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
//             startingPrice,
//             TickMath.getSqrtPriceAtTick(tickLower),
//             TickMath.getSqrtPriceAtTick(tickUpper),
//             token0Amount,
//             token1Amount
//         );

//         // Slippage caps
//         uint256 amount0Max = token0Amount + 1;
//         uint256 amount1Max = token1Amount + 1;

//         // Build mint params via helper
//         (bytes memory actions, bytes[] memory mintParams) = _mintLiquidityParams(
//             poolKey, tickLower, tickUpper, liquidity, amount0Max, amount1Max, deployerAddress, hookData
//         );

//         // ✅ DECLARE the array BEFORE using it
//         bytes;

//         // Initialize pool
//         multicallData[0] = abi.encodeWithSelector(
//             positionManager.initializePool.selector,
//             poolKey,
//             startingPrice,
//             hookData
//         );

//         // Mint liquidity (note: pass actions and mintParams as separate args)
//         multicallData[1] = abi.encodeWithSelector(
//             positionManager.modifyLiquidities.selector,
//             actions,
//             mintParams,
//             block.timestamp + 3600
//         );

//         // If token0 is native, send ETH along
//         uint256 valueToPass = (Currency.unwrap(poolKey.currency0) == address(0)) ? amount0Max : 0;

//         vm.startBroadcast();

//         // Approve ERC20 side(s) via Permit2; helper MUST skip native
//         tokenApprovals();

//         // Create pool + add liquidity atomically
//         positionManager.multicall{value: valueToPass}(multicallData);

//         vm.stopBroadcast();

//         console2.log("Pool created & liquidity minted");
//         console2.log("tickLower", tickLower);
//         console2.log("tickUpper", tickUpper);
//     }
// }
