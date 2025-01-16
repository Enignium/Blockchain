// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

contract FileStorage {

    uint maxSpace = 2**30 * 5 ; //5 GB

    struct File {
        bytes content;
    }

    struct FileSpace {
        
        mapping(string => File) files;
        string[] file_names;
        uint file_num;
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

        if(!isFileAlreadyIn(name)){
            users[msg.sender].file_names.push(name);
            users[msg.sender].file_num++;
        }

    }

    function getFile(string memory name) public view returns (bytes memory) {
        File memory f = users[msg.sender].files[name];
        return (f.content);
    }

    function getFileNames() public view returns (string memory){
        
        string memory names = "";

        for(uint i = 0; i < users[msg.sender].file_num; i++){
           names = string(abi.encodePacked(names, users[msg.sender].file_names[i]));
           names = string(abi.encodePacked(names, ","));
        }

        return names;

    }

    function isFileAlreadyIn(string memory name) private view returns (bool){
        
        for (uint256 i = 0; i < users[msg.sender].file_num; i++) {
            if (keccak256(abi.encodePacked(users[msg.sender].file_names[i])) == keccak256(abi.encodePacked(name))) {
                return true;
            }
        }
        return false;
    }


    function getSpaceLeft() public view returns (uint) {
        return maxSpace - users[msg.sender].occupiedSpace;
    }
    
}
