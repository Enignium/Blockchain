const { task } = require("hardhat/config");

task("spaceLeft", "le cose forse hanno senso")

  .setAction(async (taskArgs) => {

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    
    
    const FileStorage = await ethers.getContractFactory("FileStorage");

     
     const contract = FileStorage.attach(contractAddress);

    const account = process.env.ACCOUNT_ADDRESS;

  
    const signer = await ethers.getSigner(account);
    const contractWithSigner = contract.connect(signer);


   
    spaceleft = await contractWithSigner.getSpaceLeft()
    console.log(spaceleft);
    
  });