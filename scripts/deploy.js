async function main() {

    const FileStorage = await ethers.getContractFactory("FileStorage");
    const contract = await FileStorage.deploy();
    console.log("Contratto lanciato!");
}

main();