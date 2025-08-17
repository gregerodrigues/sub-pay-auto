// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {BaseHook}       from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {IPoolManager}   from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey}        from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {BalanceDelta}   from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {SwapParams}     from "@uniswap/v4-core/src/types/PoolOperation.sol";
import {Hooks}          from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IERC20}         from "forge-std/interfaces/IERC20.sol";
import {Currency}       from "@uniswap/v4-core/src/types/Currency.sol";

contract SimpleFeeShareHook is BaseHook {
    using PoolIdLibrary for PoolKey;

    // --- owner ---
    address public owner;
    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }

    constructor(IPoolManager pm) BaseHook(pm) { owner = msg.sender; }

    // --- minimal per-pool config ---
    struct Config {
        uint16  splitBps;     // e.g. 3000 = 30% of collected fees go to depositors
        uint64  minInterval;  // seconds between heartbeats
    }
    mapping(PoolId => Config) public configs;
    mapping(PoolId => uint64) public lastRunAt;

    event ConfigSet(PoolId indexed id, uint16 splitBps, uint64 minInterval);
    function setConfig(PoolKey calldata key, uint16 splitBps, uint64 minInterval) external onlyOwner {
        require(splitBps <= 10_000, "split>100%");
        PoolId pid = key.toId();
        configs[pid] = Config({splitBps: splitBps, minInterval: minInterval});
        emit ConfigSet(pid, splitBps, minInterval);
    }

    // --- simple in-kind rewards (per pool) ---
    uint256 private constant ACC = 1e12;

    struct User {
        uint128 shares; // 1 share = 1 token0 unit deposited (MVP)
        uint128 r0Debt; // accounting debt for token0
        uint128 r1Debt; // accounting debt for token1
    }

    mapping(PoolId => uint256) public acc0PerShare;
    mapping(PoolId => uint256) public acc1PerShare;
    mapping(PoolId => uint128) public totalShares;
    mapping(PoolId => mapping(address => User)) public users;

    event Deposited(PoolId indexed id, address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(PoolId indexed id, address indexed user, uint256 shares, uint256 amt0);
    event Claimed(PoolId indexed id, address indexed user, uint256 amt0, uint256 amt1);
    event FeesNotified(PoolId indexed id, uint256 toDepositors0, uint256 toDepositors1);
    event FeeSplitTick(PoolId indexed id, uint64 nowTs);

    // === MVP: deposit token0 only ===
    function depositToken0(PoolKey calldata key, uint256 amount) external {
        require(amount > 0, "zero");
        PoolId pid = key.toId();

        address token0 = Currency.unwrap(key.currency0);
        require(token0 != address(0), "native not supported");

        // pull token0
        require(IERC20(token0).transferFrom(msg.sender, address(this), amount), "transferFrom fail");

        // mint shares 1:1 with token0
        User storage u = users[pid][msg.sender];
        _harvestToUser(pid, u);
        u.shares += uint128(amount);
        totalShares[pid] += uint128(amount);

        emit Deposited(pid, msg.sender, amount, amount);
    }

    // withdraw shares as token0 (principal only; claim rewards separately)
    function withdrawToken0(PoolKey calldata key, uint256 shares) external {
        require(shares > 0, "zero");
        PoolId pid = key.toId();
        User storage u = users[pid][msg.sender];
        require(u.shares >= shares, "insufficient");

        _harvestToUser(pid, u);
        u.shares -= uint128(shares);
        totalShares[pid] -= uint128(shares);

        address token0 = Currency.unwrap(key.currency0);
        require(IERC20(token0).transfer(msg.sender, shares), "transfer fail");

        emit Withdrawn(pid, msg.sender, shares, shares);
    }

    // claim pro-rata in-kind rewards (token0 + token1)
    function claim(PoolKey calldata key) external {
        PoolId pid = key.toId();
        User storage u = users[pid][msg.sender];
        (uint256 p0, uint256 p1) = _pending(pid, u);

        if (p0 > 0) {
            u.r0Debt += uint128(p0);
            require(IERC20(Currency.unwrap(key.currency0)).transfer(msg.sender, p0), "t0 xfer");
        }
        if (p1 > 0) {
            u.r1Debt += uint128(p1);
            require(IERC20(Currency.unwrap(key.currency1)).transfer(msg.sender, p1), "t1 xfer");
        }
        emit Claimed(pid, msg.sender, p0, p1);
    }

    function pending(PoolKey calldata key, address user) external view returns (uint256 p0, uint256 p1) {
        return _pending(key.toId(), users[key.toId()][user]);
    }

    function _pending(PoolId pid, User memory u) internal view returns (uint256 p0, uint256 p1) {
        if (u.shares == 0) return (0, 0);
        p0 = (uint256(u.shares) * acc0PerShare[pid]) / ACC - u.r0Debt;
        p1 = (uint256(u.shares) * acc1PerShare[pid]) / ACC - u.r1Debt;
    }

    function _harvestToUser(PoolId pid, User storage u) internal {
        if (u.shares == 0) return;
        uint256 p0 = (uint256(u.shares) * acc0PerShare[pid]) / ACC - u.r0Debt;
        uint256 p1 = (uint256(u.shares) * acc1PerShare[pid]) / ACC - u.r1Debt;
        if (p0 > 0) u.r0Debt += uint128(p0);
        if (p1 > 0) u.r1Debt += uint128(p1);
    }

    // owner tells the contract “we just collected X/Y fees to this hook”
    function notifyFees(PoolKey calldata key, uint256 collected0, uint256 collected1) external onlyOwner {
        PoolId pid = key.toId();
        Config memory cfg = configs[pid];
        require(cfg.splitBps <= 10_000, "cfg");

        uint256 toDep0 = (collected0 * cfg.splitBps) / 10_000;
        uint256 toDep1 = (collected1 * cfg.splitBps) / 10_000;

        if (toDep0 > 0 && totalShares[pid] > 0) {
            acc0PerShare[pid] += (toDep0 * ACC) / totalShares[pid];
        }
        if (toDep1 > 0 && totalShares[pid] > 0) {
            acc1PerShare[pid] += (toDep1 * ACC) / totalShares[pid];
        }

        emit FeesNotified(pid, toDep0, toDep1);
        // remainder stays here for now (you can sweep/compound later)
    }

    // --- hook perms + heartbeat ---
    function getHookPermissions() public pure override returns (Hooks.Permissions memory p) {
        p.afterSwap = true;
    }

    function _afterSwap(
        address, PoolKey calldata key, SwapParams calldata, BalanceDelta, bytes calldata
    ) internal override returns (bytes4, int128) {
        PoolId pid = key.toId();
        Config memory c = configs[pid];
        if (c.minInterval == 0) return (BaseHook.afterSwap.selector, 0);

        uint64 t = uint64(block.timestamp);
        if (t < lastRunAt[pid] + c.minInterval) return (BaseHook.afterSwap.selector, 0);

        lastRunAt[pid] = t;
        emit FeeSplitTick(pid, t);
        return (BaseHook.afterSwap.selector, 0);
    }

    // --- emergency (optional) ---
    function rescueToken(address token, address to, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "rescue fail");
    }
}
