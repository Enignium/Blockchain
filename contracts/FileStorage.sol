// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; //Specifica quale versione del compilatore può compilare questo contratto

contract FileStorage {

    struct File {
        string name;
        string content;
        address owner;
    }

    mapping(uint => File) public files;

    uint public fileCount;

    constructor(){
        fileCount = 0;
    }
    
    //modificatore memory : indica che una variabile esiste solo durante l'esecuzione della funzione ed eliminata una volta terminata
    function uploadFile(string memory name, string memory content) public {
        files[fileCount] = File(name, content, msg.sender);
        fileCount++;
    }
    //modificatore view: indica che la funzione quando chiamata può solo leggere lo stato del contratto ma non modificarlo
    function getFile(uint fileId) public view returns (string memory, string memory, address) {
        File memory f = files[fileId];
        return (f.name, f.content, f.owner);
    }

    function getFileNum() public view returns (uint) {
        return (fileCount);
    }
    
}
