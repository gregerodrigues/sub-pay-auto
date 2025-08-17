// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import {Hooks}         from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IPoolManager}  from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {HookMiner}     from "@uniswap/v4-periphery/src/utils/HookMiner.sol";
import {FeeSplitHook}  from "../src/FeeSplitHook.sol";

contract DeployFeeSplit is Script {
    // fill in Unichain Sepolia PoolManager address you are using
    address constant POOL_MANAGER = 0x00B036B58a818B1BC34d502D3fE730Db729e62AC;
    address constant CREATE2_DEPLOYER = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

    function run() external {
        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);
        bytes memory constructorArgs = abi.encode(IPoolManager(POOL_MANAGER));

        (address mined, bytes32 salt) =
            HookMiner.find(CREATE2_DEPLOYER, flags, type(FeeSplitHook).creationCode, constructorArgs);

        vm.startBroadcast();
        FeeSplitHook hook = new FeeSplitHook{salt: salt}(IPoolManager(POOL_MANAGER));
        require(address(hook) == mined, "mined address mismatch");
        vm.stopBroadcast();

        console2.log("FeeSplitHook:", address(hook));
    }
}
