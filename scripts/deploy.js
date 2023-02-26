const { ethers } = require("hardhat");

async function main() {
  const GoldToken = await ethers.getContractFactory("GLDToken");

  const totalSupply = ethers.utils.parseEther('1000');

  const goldToken = await GoldToken.deploy(totalSupply);

  console.log(`Contract deployed to address ${goldToken.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
