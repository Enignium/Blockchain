const { task } = require("hardhat/config");
require("dotenv").config();

task("upload", "Carica un file")
  .addPositionalParam("path")
  .setAction(async (taskArgs) => {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  
    const FileStorage = await ethers.getContractFactory("FileStorage");
    const contract = FileStorage.attach(contractAddress);
    const account = process.env.ACCOUNT_ADDRESS;
    const signer = await ethers.getSigner(account);
    const contractWithSigner = contract.connect(signer);
    const spaceLeft = await contractWithSigner.getSpaceLeft();
    const fs = require('fs');
    const path = require('path');

    const contentBytes = fs.readFileSync(taskArgs.path);

    const gasLimit = 2000000;
    if(BigInt(spaceLeft) - BigInt(contentBytes.length)  > 0){
      const tx = await contractWithSigner.uploadFile(path.basename(taskArgs.path), contentBytes, { gasLimit });
      await tx.wait();

      console.log(`File caricato: ${path.basename(taskArgs.path)}`);
    }
    else
      console.log(`Spazio esaurito :(`);
  });
