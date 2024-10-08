async function main() {
    const FileStorage = await ethers.getContractFactory("FileStorage");
    const contract = await FileStorage.deploy();
    console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
