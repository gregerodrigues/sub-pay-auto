// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import {Hooks}            from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IPoolManager}     from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {HookMiner}        from "@uniswap/v4-periphery/src/utils/HookMiner.sol";
import {AutoCompoundHook} from "../src/AutoCompoundHook.sol";

contract DeployAutoCompound is Script {
    // Unichain Sepolia v4 PoolManager (official)
    // address constant POOL_MANAGER = 0x00B036B58a818B1BC34d502D3fE730Db729e62AC;
    address constant POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;
    
    // CREATE2 deployer used by v4 hook tooling
    address constant CREATE2_DEPLOYER = 0x4e59b44847b379578588920cA78FbF26c0B4956C;

    function run() external {
        // We only set AFTER_SWAP flag
        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);
        bytes memory constructorArgs = abi.encode(IPoolManager(POOL_MANAGER));

        // mine the salt for an address with the required flag bits
        (address mined, bytes32 salt) =
            HookMiner.find(CREATE2_DEPLOYER, flags, type(AutoCompoundHook).creationCode, constructorArgs);

        vm.startBroadcast();
        AutoCompoundHook hook = new AutoCompoundHook{salt: salt}(IPoolManager(POOL_MANAGER));
        require(address(hook) == mined, "mined address mismatch");
        vm.stopBroadcast();

        console2.log("AutoCompoundHook:", address(hook));
    }
}
