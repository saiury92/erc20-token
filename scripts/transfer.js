require('dotenv').config();
const { ethers } = require("ethers");
const { abi: contractABI } = require("../artifacts/contracts/GLDToken.sol/GLDToken.json");

async function transfer(to) {
  // Set Provider
  const rpc = process.env.PROVIDER_URL;
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  // Contract Interface
  const contractAddress = "0xB0c072dDeaFCa10B5347936d3e5d50f449273AFb";
  const etherInterface = new ethers.utils.Interface(contractABI);

  // Wallet
  const publicKey = "0x4F128c650FBe3a9f83BeA58069e16a34f9E6213e";
  const privateKey = `0x${process.env.PRIVATE_KEY}`;
  const wallet = new ethers.Wallet(privateKey, provider);

  // Get latest nonce
  const nonce = await provider.getTransactionCount(publicKey, "latest");

  // Get gas price
  const gasPrice = await provider.getGasPrice();

  // Get network
  const network = await provider.getNetwork();
  const { chainId } = network;

  console.log(`None: ${nonce}`, `Gas price: ${gasPrice.toNumber()}`, `Chain ID: ${chainId}`);

  const transaction = {
    from: publicKey,
    to: contractAddress,
    nonce,
    chainId,
    gasPrice,
    data: etherInterface.encodeFunctionData("transfer", [to, ethers.utils.parseEther('1.0')])
  };

  //Estimate gas limit
  const estimatedGas = await provider.estimateGas(transaction);
  console.log(`Estimate gas: ${estimatedGas.toNumber()}`);
  transaction["gasLimit"] = estimatedGas;

  //Sign & Send transaction
  const signedTx = await wallet.signTransaction(transaction);
  const transactionReceipt = await provider.sendTransaction(signedTx);
  await transactionReceipt.wait();
  const hash = transactionReceipt.hash;
  console.log("Your Transaction Hash is:", hash);

  // Get transaction receipt
  const receipt = await provider.getTransactionReceipt(hash);
  const { logs: [event] } = receipt;

  // Decode logs
  const decodedLogs = etherInterface.decodeEventLog('Transfer', event.data, event.topics);
  console.log(`\n` +
    `New ERC-20 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
    `From: ${decodedLogs.from}\n` +
    `To: ${decodedLogs.to}\n` +
    `value: ${ethers.utils.formatEther(decodedLogs.value)} GLD`
  );
}

transfer("0x95C8D673757f5CcA00854E7012b5427AEd1377F3").catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
