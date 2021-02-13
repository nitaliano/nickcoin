import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';

import NickCoin from '../build/NickCoinERC20.json';

use(solidity);

describe('NickCoin', () => {
  const provider = new MockProvider();
  const [wallet, walletTo] = provider.getWallets();

  const totalSupply = 100;

  let contract: Contract;

  beforeEach(async () => {
    contract = await deployContract(wallet, NickCoin, [totalSupply]);
  });

  context('initialization', () => {
    it('owner has expected balance', async () => {
      const balance = await contract.balanceOf(wallet.address);
      expect(balance).to.equal(totalSupply);
    });
  
    it('has expected total supply', async () => {
      const actualTotalSupply = await contract.totalSupply();
      expect(actualTotalSupply).to.equal(totalSupply);
    });
  });

  context('transfer', () => {
    it('sends expected amount to recipent', async () => {
      const amount = 10;
      await contract.transfer(walletTo.address, amount);

      const balance = await contract.balanceOf(walletTo.address);
      expect(balance).to.equal(balance);

      const ownerBalance = await contract.balanceOf(wallet.address);
      expect(ownerBalance).to.equal(totalSupply - amount);
    });

    it('emits Transfer event', async () => {
      await expect(contract.transfer(walletTo.address, 1))
        .to.emit(contract, 'Transfer')
        .withArgs(wallet.address, walletTo.address, 1);
    });

    it('does not work with higher amount than exists in balance', async () => {
      await expect(contract.transfer(walletTo.address, totalSupply * 2)).to.be.reverted;
    });
  });

  context('delegate', async () => {
    it('approves delegate for expected amount', async () => {
      const amount = 10;
      await contract.approve(walletTo.address, amount);

      const allowance = await contract.allowance(wallet.address, walletTo.address);
      expect(allowance).to.equal(amount);
    });

    it('emits Approval event', async () => {
      await expect(contract.approve(walletTo.address, 1))
        .to.emit(contract, 'Approval')
        .withArgs(wallet.address, walletTo.address, 1);
    });

    it('transfer funds to recipient', async () => {
      const amount = 10;
      await contract.approve(walletTo.address, amount);

      const delegate = contract.connect(walletTo);
      const recipient = provider.createEmptyWallet();

      await delegate.transferFrom(wallet.address, recipient.address, amount);

      const ownerBalance = await contract.balanceOf(wallet.address);
      const delegateAllowance = await contract.allowance(wallet.address, walletTo.address);
      const recipientBalance = await contract.balanceOf(recipient.address);

      expect(ownerBalance).to.equal(totalSupply - amount);
      expect(delegateAllowance).to.equal(0);
      expect(recipientBalance).to.equal(amount);
    });

    it('emits Transfer event', async () => {
      await contract.approve(walletTo.address, 1);

      const delegate = contract.connect(walletTo);
      const recipient = provider.createEmptyWallet();

      await expect(delegate.transferFrom(wallet.address, recipient.address, 1))
        .to.emit(delegate, 'Transfer')
        .withArgs(wallet.address, recipient.address, 1);
    });

    it('does not work when delegate amount is higher than owner balance', async () => {
      await contract.approve(walletTo.address, 1);
      
      const delegate = contract.connect(walletTo);
      const recipent = provider.createEmptyWallet();
  
      await expect(delegate.transferFrom(wallet.address, recipent.address, totalSupply + 1)).to.be.reverted;
    });

    it('does not work when delegate allowance is higher than owner balance', async () => {
      const allowance = 5;
      await contract.approve(walletTo.address, allowance);
      
      const delegate = contract.connect(walletTo);
      const recipent = provider.createEmptyWallet();
  
      await expect(delegate.transferFrom(wallet.address, recipent.address, allowance + 1)).to.be.reverted;
    });
  });
});
