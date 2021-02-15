import fs from 'fs';
import { ethers } from "ethers";

type ContractFactoryConfig = {
  contractName: string;
  signer: ethers.Wallet;
};

type ContractConfig = {
  address: string;
  contractName: string;
  signer: ethers.Wallet;
};

type ParsedContractJSON = {
  abi: ethers.ContractInterface;
  bytecode: ethers.utils.Bytes;
}

const buildContractURI = (contractName: string): string => `./build/${contractName}.json`;

function parseContractJSON(uri: string): ParsedContractJSON {
  const buffer = fs.readFileSync(uri);
  const { abi, bytecode } = JSON.parse(buffer.toString());
  return { abi, bytecode };     
}

export function getContractFactory(config: ContractFactoryConfig): ethers.ContractFactory {
  const { abi, bytecode } = parseContractJSON(buildContractURI(config.contractName));            
  return new ethers.ContractFactory(abi, bytecode, config.signer);
}

export function getContract(config: ContractConfig): ethers.Contract {
  const { abi } = parseContractJSON(buildContractURI(config.contractName));
  return new ethers.Contract(config.address, abi, config.signer);
}
