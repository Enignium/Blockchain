const { task } = require("hardhat/config");
require("dotenv").config();

task("download", "testo")
  .addPositionalParam("id")
  .setAction(async (taskArgs) => {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const FileStorage = await ethers.getContractFactory("FileStorage");
    const contract = FileStorage.attach(contractAddress);
    const account = process.env.ACCOUNT_ADDRESS;
    const signer = await ethers.getSigner(account);
    const contractWithSigner = contract.connect(signer);
    const content = await contractWithSigner.getFile(taskArgs.id);
    const hexString = content.replace(/^0x/, '');
    const contentBuffer = Buffer.from(hexString,'hex');

    const fs = require('fs');

    if (!fs.existsSync('./download')) {
        fs.mkdirSync('./download');
      }

    fs.writeFileSync("./download/" + taskArgs.id, contentBuffer); 
    
});