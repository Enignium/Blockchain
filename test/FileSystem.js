const { expect } = require("chai");

describe("Contratto filesystem", function () {
  it("Il file FileTest deve essere memorizzato con contenuto \"Contenuto file test\" ", async function () {

    const hardhatFileSystem = await ethers.deployContract("FileSystem");
    
    expect(await hardhatFileSystem.getFile("FileTest")).to.equal("Contenuto file test");

  });
  it("Un file memorizzato deve rimanere in memoria con il contenuto con cui è stato memorizzato e associato al suo nome", async function () {

    const hardhatFileSystem = await ethers.deployContract("FileSystem");
    
    await hardhatFileSystem.storeFile("TestTest","Questo è un test");

    expect(await hardhatFileSystem.getFile("TestTest")).to.equal("Questo è un test");

  });
});