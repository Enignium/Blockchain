const { task } = require("hardhat/config");

task("filenum", "le cose forse hanno senso")

  .setAction(async (taskArgs) => {

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    
    // Ottieni il factory del contratto
    const FileStorage = await ethers.getContractFactory("FileStorage");

    // Connettiti al contratto già deployato
    const contract = FileStorage.attach(contractAddress);
    filenum = await contract.getFileNum()
    console.log(filenum);
    
  });