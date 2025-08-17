// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {BaseHook}                 from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {IPoolManager}             from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey}                  from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary}    from "@uniswap/v4-core/src/types/PoolId.sol";
import {BalanceDelta}             from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {SwapParams}               from "@uniswap/v4-core/src/types/PoolOperation.sol";
import {Hooks}                    from "@uniswap/v4-core/src/libraries/Hooks.sol";

contract AutoCompoundHook is BaseHook {
    using PoolIdLibrary for PoolKey;

    event Tick(PoolId indexed id, uint256 timestamp);

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory p) {
        p.afterSwap = true; // opt-in to afterSwap
    }

    // Match the template's internal hook signature exactly:
    // returns (bytes4 selector, int128 liquidityDelta)
    function _afterSwap(
        address,                 // sender (unused)
        PoolKey calldata key,
        SwapParams calldata,     // params (unused for now)
        BalanceDelta,            // delta (unused for now)
        bytes calldata           // hookData (unused for now)
    ) internal override returns (bytes4, int128) {
        // For now just emit an event so you can see it triggering
        emit Tick(key.toId(), block.timestamp);

        // Return the standard selector and 0 liquidity change (no-op)
        return (BaseHook.afterSwap.selector, 0);
    }
}
