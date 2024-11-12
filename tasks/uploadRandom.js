const { task } = require("hardhat/config");
require("dotenv").config();

task("uploadRandom", "Carica un file random")
  .addPositionalParam("fileLenght")

  .setAction(async (taskArgs) => {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const randomstring = require("randomstring");
    const FileStorage = await ethers.getContractFactory("FileStorage");
    const contract = FileStorage.attach(contractAddress);
    const account = process.env.ACCOUNT_ADDRESS;
    const signer = await ethers.getSigner(account);
    const contractWithSigner = contract.connect(signer);
    const gasLimit = 2000000;
    const contentBuffer = Buffer.alloc(parseInt(taskArgs.fileLenght)).fill(1);
    
    const tx = await contractWithSigner.uploadFile(randomstring.generate(15), contentBuffer, { gasLimit });
    await tx.wait();

    console.log("FILE CARICATO!!!");

   
  
  });
