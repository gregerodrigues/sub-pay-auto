// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {BaseHook}                 from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {IPoolManager}             from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey}                  from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary}    from "@uniswap/v4-core/src/types/PoolId.sol";
import {BalanceDelta}             from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {SwapParams}               from "@uniswap/v4-core/src/types/PoolOperation.sol";
import {Hooks}                    from "@uniswap/v4-core/src/libraries/Hooks.sol";

/// @dev Minimal, safe MVP: we only emit on swap and gate calls with a time + dust threshold.
/// Later we’ll add lock + collect + split.
contract FeeSplitHook is BaseHook {
    using PoolIdLibrary for PoolKey;

    struct Config {
        uint16  splitBps;      // e.g., 3000 = 30% to target token
        uint64  minInterval;   // seconds between attempts
        uint128 minFees0;      // simple dust gate (approx, used as a trigger)
        uint128 minFees1;      // simple dust gate
        address targetToken;   // must be token0 or token1 of this pool for v1
        address recipient;     // optional: where to sweep target to
        int24   lower;         // your LP ticks (optional for v1)
        int24   upper;
    }

    event FeeSplitTick(PoolId indexed id, uint64 nowTs);
    event ConfigSet(PoolId indexed id, Config cfg);

    // Per pool storage
    mapping(PoolId => Config) public configs;
    mapping(PoolId => uint64) public lastRunAt;

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {}

    function getHookPermissions() public pure override returns (Hooks.Permissions memory p) {
        p.afterSwap = true; // we only need afterSwap as a “ticker”
    }

    /// @notice Set/replace config for a pool (call this once after your position is minted)
    function setConfig(
        PoolKey calldata key,
        uint16 splitBps,
        uint64 minInterval,
        uint128 minFees0,
        uint128 minFees1,
        address targetToken,
        address recipient,
        int24 lower,
        int24 upper
    ) external {
        require(splitBps <= 10_000, "splitBps>100%");
        PoolId pid = key.toId();
        configs[pid] = Config({
            splitBps: splitBps,
            minInterval: minInterval,
            minFees0: minFees0,
            minFees1: minFees1,
            targetToken: targetToken,
            recipient: recipient,
            lower: lower,
            upper: upper
        });
        emit ConfigSet(pid, configs[pid]);
    }

    /// INTERNAL HOOK (template pattern): returns (selector, liquidityDelta)
    function _afterSwap(
        address,              // sender
        PoolKey calldata key,
        SwapParams calldata,  // params
        BalanceDelta,         // delta
        bytes calldata        // hookData
    ) internal override returns (bytes4, int128) {
        PoolId pid = key.toId();
        Config memory c = configs[pid];
        if (c.minInterval == 0) {
            // not configured yet → do nothing
            return (BaseHook.afterSwap.selector, 0);
        }

        // basic rate limit
        uint64 t = uint64(block.timestamp);
        if (t < lastRunAt[pid] + c.minInterval) {
            return (BaseHook.afterSwap.selector, 0);
        }

        // MVP: just emit a heartbeat.
        // PHASE 2 (you’ll add): poolManager.lock(...) → _unlockCallback() to:
        //   1) collect fees to the hook
        //   2) compute split = fees * splitBps / 10_000
        //   3) if targetToken == token0 or token1, keep that portion in “bucket” (or send to recipient)
        //   4) optional: add the remainder back as liquidity for compounding
        emit FeeSplitTick(pid, t);
        lastRunAt[pid] = t;

        return (BaseHook.afterSwap.selector, 0);
    }

    // When you’re ready to implement real splitting:
    // function _unlockCallback(bytes calldata data) internal override returns (bytes memory) {
    //     // decode poolKey/config; poolManager.collect(...);
    //     // compute split; optionally swap-to-target or keep if already target;
    //     // optional: poolManager.modifyPosition(...) to re-add remainder;
    //     // return "";
    // }
}
