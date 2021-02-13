require('dotenv').config();

const fs = require('fs');
const { ethers } = require('ethers');

const CONTRACT_NAME = 'NickCoinERC20';
const TOTAL_SUPPLY = 21000000;

const provider = new ethers.providers.InfuraProvider(
  process.env.ETH_NETWORK,
  process.env.INFURA_PROJECT_ID,
);

const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

async function main() {
  const { abi, bytecode } = JSON.parse(fs.readFileSync(`./build/${CONTRACT_NAME}.json`));
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  
  console.log(`Attempting to deploy ${CONTRACT_NAME}`);
  const contract = await factory.deploy(TOTAL_SUPPLY);
  console.log(`Deploy Tx Hash: ${contract.deployTransaction.hash}`);

  console.log('Waiting for transaction to be mined...');
  await contract.deployTransaction.wait();
  console.log(`Contract Deployed at Address: ${contract.address}`);
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();
