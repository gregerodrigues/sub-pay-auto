// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BaseScript} from "./base/BaseScript.sol";

import {IUniswapV4Router04} from "hookmate/interfaces/router/IUniswapV4Router04.sol";
import {AddressConstants}    from "hookmate/constants/AddressConstants.sol";

contract SwapScript is BaseScript {
    function run() external {
        // Router for current chain (Unichain Sepolia)
        IUniswapV4Router04 swapRouter =
            IUniswapV4Router04(payable(AddressConstants.getV4SwapRouterAddress(block.chainid)));

        // PoolKey MUST match how you initialized the pool (same hook addr!)
        PoolKey memory key = PoolKey({
            currency0: currency0,  // USDC
            currency1: currency1,  // WETH
            fee: 3000,
            tickSpacing: 60,
            hooks: hookContract    // use address(0) if you created pool without a hook
        });

        vm.startBroadcast();

        // Approve router (simplest for scripts)
        token0.approve(address(swapRouter), type(uint256).max); // USDC (6d)
        token1.approve(address(swapRouter), type(uint256).max); // WETH (18d)

        // 1) 1 USDC -> WETH (sell currency0 for currency1)
        swapRouter.swapExactTokensForTokens({
            amountIn: 1e6,               // 1 USDC
            amountOutMin: 0,             // test-only
            zeroForOne: true,            // currency0 -> currency1
            poolKey: key,
            hookData: "",
            receiver: deployerAddress,
            deadline: block.timestamp + 300
        });

        // 2) 0.001 WETH -> USDC (sell currency1 for currency0)
        swapRouter.swapExactTokensForTokens({
            amountIn: 1e15,              // 0.001 WETH
            amountOutMin: 0,
            zeroForOne: false,           // currency1 -> currency0
            poolKey: key,
            hookData: "",
            receiver: deployerAddress,
            deadline: block.timestamp + 300
        });

        vm.stopBroadcast();
    }
}
