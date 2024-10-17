const { task } = require("hardhat/config");
require("dotenv").config();

task("get", "le cose forse hanno senso")
  .addPositionalParam("id")

  .setAction(async (taskArgs) => {

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    
    const FileStorage = await ethers.getContractFactory("FileStorage");

    const contract = FileStorage.attach(contractAddress);

     const account = process.env.ACCOUNT_ADDRESS;

    
     const signer = await ethers.getSigner(account);
     const contractWithSigner = contract.connect(signer);

    const content = await contractWithSigner.getFile(taskArgs.id);
    
    //0x70696e6f <--- TESTO! STRINGA! NON SONO I BYTE IN MEMORIA!

    const hexString = content.replace(/^0x/, '');
    //70696e6f SE TU GUARDI LA MEMORIA VEDRAI 55 - 48 - 54 - 57 - ECC
    //TU VUOI AVERE IN MEMORIA 70 - 69 - 6E - 6F ! 

    const stringa = Buffer.from(hexString,'hex');
    
    //70 69 6e 6f

    console.log(`contenuto content: ${stringa}`);

    
  });