/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const { PROVIDER_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: PROVIDER_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
};
