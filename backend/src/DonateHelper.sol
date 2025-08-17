// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey}      from "@uniswap/v4-core/src/types/PoolKey.sol";
import {Currency, CurrencyLibrary} from "@uniswap/v4-core/src/types/Currency.sol";

contract DonateHelper {
    using CurrencyLibrary for Currency;

    IPoolManager public immutable manager;

    constructor(IPoolManager _manager) { manager = _manager; }

    modifier onlyByManager() {
        require(msg.sender == address(manager), "not PoolManager");
        _;
    }

    struct Op {
        PoolKey key;
        uint256 amt0;
        uint256 amt1;
        bytes   hookData;
    }

    /// Pre-transfer ERC20s to this contract before calling donate(...)
    function donate(PoolKey memory key, uint256 amt0, uint256 amt1, bytes memory hookData) external {
        address t0 = Currency.unwrap(key.currency0);
        address t1 = Currency.unwrap(key.currency1);

        if (!key.currency0.isAddressZero() && amt0 > 0) {
            IERC20(t0).transferFrom(msg.sender, address(this), amt0);
        }
        if (!key.currency1.isAddressZero() && amt1 > 0) {
            IERC20(t1).transferFrom(msg.sender, address(this), amt1);
        }

        // ---- version-agnostic lock ----
        bytes memory payload = abi.encode(Op(key, amt0, amt1, hookData));

        // Try lock(bytes)
        (bool ok, ) = address(manager).call(
            abi.encodeWithSignature("lock(bytes)", payload)
        );

        // Fallback: lock(address,bytes)
        if (!ok) {
            (ok, ) = address(manager).call(
                abi.encodeWithSignature("lock(address,bytes)", address(this), payload)
            );
            require(ok, "PoolManager.lock(address,bytes) failed");
        }
    }

    /// PoolManager callback during unlock
    function unlockCallback(bytes calldata data) external onlyByManager returns (bytes memory) {
        Op memory op = abi.decode(data, (Op));

        // Make balances visible to the manager
        if (!op.key.currency0.isAddressZero()) manager.sync(op.key.currency0);
        if (!op.key.currency1.isAddressZero()) manager.sync(op.key.currency1);

        // This will revert if the poolKey is NOT an initialized pool
        manager.donate(op.key, op.amt0, op.amt1, op.hookData);

        // Settle the negative deltas (version-agnostic settle)
        if (op.amt0 > 0) _settleCurrency(op.key.currency0, op.amt0);
        if (op.amt1 > 0) _settleCurrency(op.key.currency1, op.amt1);

        return "";
    }

    function _settleCurrency(Currency c, uint256 amount) internal {
        address token = Currency.unwrap(c);

        if (token == address(0)) {
            // Native: try settle(Currency) then settle(Currency,address,uint256)
            (bool ok, ) = address(manager).call{value: amount}(
                abi.encodeWithSignature("settle((address))", c)
            );
            if (!ok) {
                (ok, ) = address(manager).call{value: amount}(
                    abi.encodeWithSignature(
                        "settle((address),address,uint256)", c, address(this), amount
                    )
                );
                require(ok, "settle native failed");
            }
        } else {
            // ERC20: push to manager then try both settle ABIs
            IERC20(token).transfer(address(manager), amount);

            (bool ok, ) = address(manager).call(
                abi.encodeWithSignature("settle((address))", c)
            );
            if (!ok) {
                (ok, ) = address(manager).call(
                    abi.encodeWithSignature(
                        "settle((address),address,uint256)", c, address(this), amount
                    )
                );
                require(ok, "settle erc20 failed");
            }
        }
    }

    receive() external payable {}
}
