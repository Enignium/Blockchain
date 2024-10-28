/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("./tasks/get");
require("./tasks/upload");
require("./tasks/uploadString");
require("./tasks/spaceLeft")
require("./tasks/stress")
require("./tasks/download")

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "localhost", 
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  },
};
