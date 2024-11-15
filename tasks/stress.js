const { task } = require("hardhat/config");
require("dotenv").config();
task("stressVR", "controllo prestazioni")
  .addPositionalParam("fileNum")
  .addPositionalParam("fileLenght")
  .addPositionalParam("averageSleepTime")
  .addPositionalParam("iterations")

  .setAction(async (taskArgs) => {
    const fs = require('fs');
    var data = 
      {
        x: [],
        y: [],
      };
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
    var t,c;

    var randomString = require("randomstring");
    for(let j = 0; j < parseInt(taskArgs.iterations); j++){
      const sendingTime =  Date.now();
      
      for (let i = 0; i < taskArgs.fileNum; i++) {
        c = Math.random();
        t = -(parseInt(taskArgs.averageSleepTime)) - (j*25) * Math.log(c);
        
        tx = await contractWithSigner.uploadFile(randomString.generate(15) + i, contentBuffer, { gasLimit });
        
        await new Promise(resolve => setTimeout(resolve, t));

      }

      await tx.wait();

      const endTime = Date.now();

      const avgSendingTime = (parseInt(taskArgs.averageSleepTime) - (j * (parseInt(taskArgs.averageSleepTime)/taskArgs.iterations)));
      const responseTime = (endTime - sendingTime)/taskArgs.fileNum;

      data.x.push(1/avgSendingTime);
      data.y.push(1/responseTime);

      console.log("Caricati " + taskArgs.fileNum +
        "\nRate di invio medio: " + 1/avgSendingTime +
        "\nRate di risposta : " + 1/responseTime);

  }

  fs.writeFileSync('./plot/data.json', JSON.stringify(data));

});
