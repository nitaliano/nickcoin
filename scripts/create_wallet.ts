require('dotenv').config();

import { ethers } from 'ethers';

import { saveWallet } from './provider';

async function main() {
  console.log('Creating a random wallet');
  const wallet = ethers.Wallet.createRandom();
  console.log(`Created new wallet with address: ${wallet.address}`);
  console.log('Saving wallet data');
  saveWallet(wallet);
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
})();