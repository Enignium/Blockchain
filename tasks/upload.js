const { task } = require("hardhat/config");

task("upload", "non so più niente")
  .addPositionalParam("name")
  .addPositionalParam("content")
  .setAction(async (taskArgs) => {
    const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

    // Ottieni il factory del contratto
    const FileStorage = await ethers.getContractFactory("FileStorage");

    // Connettiti al contratto già deployato
    const contract = FileStorage.attach(contractAddress);

    // Chiama la funzione uploadFile con i parametri forniti
    const tx = await contract.uploadFile(taskArgs.name, taskArgs.content);

    // Attendi la conferma della transazione
    await tx.wait();

    console.log(`File caricato: ${taskArgs.name} con contenuto: ${taskArgs.content}`);
  });