// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StealthRegistry {
    struct Record { address sender; bytes ciphertext; uint256 timestamp; }
    Record[] public records;

    event NewRecord(uint indexed id, address indexed sender, bytes ciphertext, uint256 timestamp);

    function store(bytes calldata ciphertext) external {
        records.push(Record(msg.sender, ciphertext, block.timestamp));
        emit NewRecord(records.length - 1, msg.sender, ciphertext, block.timestamp);
    }

    function getRecord(uint id) public view returns (address, bytes memory, uint256) {
        Record memory r = records[id];
        return (r.sender, r.ciphertext, r.timestamp);
    }

    function totalRecords() public view returns (uint) {
        return records.length;
    }
}
