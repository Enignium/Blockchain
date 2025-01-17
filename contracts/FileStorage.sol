// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    uint maxSpace = 2**20;

    struct File {
        bytes content;
    }

    struct FileSpace {
        mapping(string => File) files;
        string[] file_names;
        mapping(string => bool) exists; 
        uint occupiedSpace; 
    }

    mapping(address => FileSpace) public users;

    function uploadFile(string memory name, bytes memory content) public {
        uint newFileSize = content.length;
        uint currentFileSize = users[msg.sender].files[name].content.length;
        uint newOccupiedSpace = users[msg.sender].occupiedSpace + newFileSize - currentFileSize;

        require(newOccupiedSpace <= maxSpace, "Spazio massimo superato");

        users[msg.sender].occupiedSpace = newOccupiedSpace;
        users[msg.sender].files[name] = File(content);

        if (!users[msg.sender].exists[name]) {
            users[msg.sender].file_names.push(name);
            users[msg.sender].exists[name] = true;
        }
    }

    function getFile(string memory name) public view returns (bytes memory) {
        require(users[msg.sender].exists[name], "File non trovato");
        return users[msg.sender].files[name].content;
    }

    function getFileNames() public view returns (string[] memory) {
        return users[msg.sender].file_names;
    }

    function isFileAlreadyIn(string memory name) public view returns (bool) {
        return users[msg.sender].exists[name];
    }

    function getSpaceLeft() public view returns (uint) {
        return maxSpace - users[msg.sender].occupiedSpace;
    }
}
