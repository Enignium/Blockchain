const { task } = require("hardhat/config");

require("dotenv").config();

task("stressVR", "controllo prestazioni")
  .addPositionalParam("fileNum")
  .addPositionalParam("fileLenght")
  .addPositionalParam("averageSleepTime")

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
    
    var t,c;

    var randomstring = require("randomstring");

    for(let j = 0; j < 20; j++){
      const sendingTime =  Date.now();
      
      for (let i = 0; i < taskArgs.fileNum; i++) {
        
        c = Math.random();
        //c num casuale 0 ad 1 t= -r *ln(c)
        t = -parseInt((taskArgs.averageSleepTime) - (j*25)) * Math.log(c);
        
        tx = await contractWithSigner.uploadFile(randomstring.generate(15) + i, contentBuffer, { gasLimit });
        

        await new Promise(resolve => setTimeout(resolve, t));

      }

      await tx.wait();

      const endTime = Date.now();

      const ResponseTime = (endTime - sendingTime)/taskArgs.fileNum;


      console.log("Caricati " + taskArgs.fileNum +
        "\nRate di invio medio: " + (1/(parseInt(taskArgs.averageSleepTime) - (j * 25))) +
        "\nRate di risposta : " + 1/ResponseTime);

  }
});
