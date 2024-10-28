// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; //Specifica quale versione del compilatore può compilare questo contratto

contract FileStorage {

    uint maxSpace = 2**20; //1 MB

    struct File {
        bytes content;
    }

    struct FileSpace {
        
        mapping(string => File) files;
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
    }

    function getFile(string memory name) public view returns (bytes memory) {
        File memory f = users[msg.sender].files[name];
        return (f.content);
    }

    function getSpaceLeft() public view returns (uint) {
        return maxSpace - users[msg.sender].occupiedSpace;
    }
    
}
