require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
    console.log("Inizio dello script...");

    // Controlla se le variabili di ambiente sono caricate correttamente
    if (!process.env.INFURA_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
        console.error("Errore: Variabili di ambiente non impostate correttamente.");
        return;
    }

    console.log("Caricamento delle variabili di ambiente...");
    console.log(`INFURA_URL: ${process.env.INFURA_URL}`);
    console.log(`PRIVATE_KEY: ${process.env.PRIVATE_KEY.slice(0, 6)}... (troncata per sicurezza)`);
    console.log(`CONTRACT_ADDRESS: ${process.env.CONTRACT_ADDRESS}`);

    try {
        const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
        console.log("Provider Ethereum creato con successo.");

        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log("Wallet creato con successo.");

        const contractAddress = process.env.CONTRACT_ADDRESS;
        console.log(`Indirizzo del contratto: ${contractAddress}`);

        // Inizializza il contratto (assicurati di avere l'ABI corretta)
        const abi = [ /* ABI del contratto */ ];
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        console.log("Contratto inizializzato con successo.");

        // Esempio di chiamata a una funzione del contratto
        console.log("Richiesta di recupero di tutti i file...");
        const files = await contract.getAllFiles(); // Cambia in base alla tua funzione
        console.log("File recuperati:", files);
    } catch (error) {
        console.error("Si è verificato un errore durante l'esecuzione dello script:", error);
    }
}

main().catch((error) => {
    console.error("Errore nell'esecuzione della funzione principale:", error);
    process.exitCode = 1;
});
