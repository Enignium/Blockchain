const { task } = require("hardhat/config");
require("dotenv").config();

task("uploadString", "Carica un file con contenuto una stringa di testo passata da parametro")
  .addPositionalParam("name")
  .addPositionalParam("content")
  .setAction(async (taskArgs) => {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  
    const FileStorage = await ethers.getContractFactory("FileStorage");

 
    const contract = FileStorage.attach(contractAddress);

    
    const account = process.env.ACCOUNT_ADDRESS;

    
    const signer = await ethers.getSigner(account);
    const contractWithSigner = contract.connect(signer);


    const contentBytes = Buffer.from(taskArgs.content, 'utf-8');

    const spaceLeft = await contractWithSigner.getSpaceLeft();
    
    if(BigInt(spaceLeft) - BigInt(contentBytes.length)  > 0){

      const tx = await contractWithSigner.uploadFile(taskArgs.name, contentBytes);

      await tx.wait();

      console.log(`File caricato: ${taskArgs.name} con contenuto: ${taskArgs.content}`);
    }
    else
      console.log(`Spazio esaurito :(`);
  });