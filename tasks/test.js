const { task } = require("hardhat/config");
require("dotenv").config();

task("test", "controllo prestazioni")
  .addPositionalParam("fileNum")
  .addPositionalParam("fileNameLenght")
  .addPositionalParam("fileLenght")

  .setAction(async (taskArgs) => {

    const startTime = Date.now();

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    
    const FileStorage = await ethers.getContractFactory("FileStorage");

    const contract = FileStorage.attach(contractAddress);

    const account = process.env.ACCOUNT_ADDRESS;

    const signer = await ethers.getSigner(account);
    const contractWithSigner = contract.connect(signer);

    const linkTime = Date.now();

    const contentBuffer = Buffer.alloc(parseInt(taskArgs.fileLenght)).fill(1)

    const gasLimit = 2000000;
    var tx;

    for (let i = 0; i < taskArgs.fileNum; i++) {
      tx = await contractWithSigner.uploadFile("f".repeat(taskArgs.fileNameLenght - 1) + i, contentBuffer, { gasLimit });
      
    }
    await tx.wait();

    const endTime = Date.now();
    
    const timeToLink = linkTime - startTime;
    const execTime = endTime - linkTime;
    const totalTime = endTime - startTime;

    console.log("Caricati " + taskArgs.fileNum + " file con keys di lunghezza " + taskArgs.fileNameLenght + 
      "\nLunghezza contenuto: " + taskArgs.fileLenght + " bytes" +
      "\nTempo per collegarsi: " + timeToLink + " ms" + 
      "\nTempo di esecuzione dal collegamento: " + execTime + " ms" + 
      "\nTempo di esecuzione totale: " + totalTime + " ms");

});