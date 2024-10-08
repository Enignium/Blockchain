// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string name;
        string content;
        address owner;
    }

    mapping(uint => File) public files;
    uint public fileCount;

    event FileUploaded(uint fileId, string name, address owner);

    function uploadFile(string memory name, string memory content) public {
        fileCount++;
        files[fileCount] = File(name, content, msg.sender);
        emit FileUploaded(fileCount, name, msg.sender);
    }

    function getFile(uint fileId) public view returns (string memory, string memory, address) {
        File memory f = files[fileId];
        return (f.name, f.content, f.owner);
    }
}
