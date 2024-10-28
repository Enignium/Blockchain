// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; //Specifica quale versione del compilatore può compilare questo contratto

contract FileStorage {

    uint maxSpace = 1048576; //1 MB

    struct File {
        bytes content;
    }

    struct FileSpace {
        
        mapping(string => File) files;
        uint occupiedSpace; 
        
    }

    mapping(address => FileSpace) public users;
    
    //modificatore memory : indica che una variabile esiste solo durante l'esecuzione della funzione ed eliminata una volta terminata
    function uploadFile(string memory name, bytes memory content) public {
        
            if(users[msg.sender].occupiedSpace + content.length < maxSpace){
                users[msg.sender].files[name] = File(content);
                users[msg.sender].occupiedSpace += content.length;
            }
    }

    //modificatore view: indica che la funzione quando chiamata può solo leggere lo stato del contratto ma non modificarlo
    function getFile(string memory name) public view returns (bytes memory) {
        File memory f = users[msg.sender].files[name];
        return (f.content);
    }

    function getSpaceLeft() public view returns (uint) {
        return maxSpace - users[msg.sender].occupiedSpace;
    }
    
}
