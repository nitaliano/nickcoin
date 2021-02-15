import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

const walletsPath = path.join('./', 'testnet_wallets');

export const provider = new ethers.providers.InfuraProvider(
  process.env.ETH_NETWORK,
  process.env.INFURA_PROJECT_ID,
);

export const contractOwner = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY as string, provider);

function createTestDir(): void {
  if (fs.existsSync(walletsPath)) {
    return;
  }
  fs.mkdirSync(walletsPath);
}

export function saveWallet(wallet: ethers.Wallet): void {
  createTestDir();
  const { address, privateKey } = wallet;
  fs.writeFileSync(path.join(walletsPath, address), privateKey);
}
