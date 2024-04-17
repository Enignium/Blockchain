pragma solidity ^0.8.0;

contract FileSystem {
    
    mapping(string => string) files;

     constructor() {
        
        files["FileTest"] = "Contenuto file test";
    }
    
    function storeFile(string memory fileName, string memory fileContent) public {
        files[fileName] = fileContent;
    }

    function getFile(string memory fileName) public view returns (string memory) {
        return files[fileName];
    }
}
