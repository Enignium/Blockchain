/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("./tasks/get");
require("./tasks/upload");
require("./tasks/uploadString");
require("./tasks/spaceLeft")
require("./tasks/uploadRandom.js")
require("./tasks/download")

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "localhost", 
  networks: {
    hardhat: {
      mining: {
        auto: false,
        gas: "auto",
        interval: 5000
        }
      },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  },
};
