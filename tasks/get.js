const { task } = require("hardhat/config");

task("get", "le cose forse hanno senso")
  .addPositionalParam("id")

  .setAction(async (taskArgs) => {

    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    
    // Ottieni il factory del contratto
    const FileStorage = await ethers.getContractFactory("FileStorage");

    // Connettiti al contratto già deployato
    const contract = FileStorage.attach(contractAddress);
    filenum = await contract.getFileNum()

    if(taskArgs.id < filenum){

    // Chiama la funzione uploadFile con i parametri forniti
        const [name, content, owner] = await contract.getFile(taskArgs.id);
        console.log(`File corrispondente: ${name}\nContenuto: ${content}`);
    }
    else{
        console.log(`File non esistente`);
    }
    
  });