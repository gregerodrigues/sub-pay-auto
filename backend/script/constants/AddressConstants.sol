// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

library AddressConstants {
    function getPoolManagerAddress(uint256 chainId) internal pure returns (address) {
        if (chainId == 1301) return 0x00B036B58a818B1BC34d502D3fE730Db729e62AC; // Unichain Sepolia
        if (chainId == 130)  return 0x1F98400000000000000000000000000000000004; // Unichain Mainnet
        revert("PoolManager: unsupported chain");
    }

    function getPositionManagerAddress(uint256 chainId) internal pure returns (address) {
        if (chainId == 1301) return 0xf969Aee60879C54bAAed9F3eD26147Db216Fd664; // Unichain Sepolia
        if (chainId == 130)  return 0x4529A01c7A0410167c5740C487A8DE60232617bf; // Unichain Mainnet
        revert("PositionManager: unsupported chain");
    }

    function getPermit2Address(uint256) internal pure returns (address) {
        // Permit2 is the same on all chains
        return 0x000000000022D473030F116dDEE9F6B43aC78BA3;
    }
}
