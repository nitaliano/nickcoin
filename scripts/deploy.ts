require('dotenv').config();

import { getContractFactory } from './contract_factory';
import { contractOwner } from './provider';

const CONTRACT_NAME = 'NickCoinERC20';
const TOTAL_SUPPLY = 21000000;

async function main() {
  const factory = getContractFactory({ contractName: CONTRACT_NAME, signer: contractOwner });
  
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
