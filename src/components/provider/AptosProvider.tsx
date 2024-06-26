import React from 'react';
import { toast } from 'react-toastify';
import { Network } from '@aptos-labs/ts-sdk';
import { AptosWalletAdapterProvider, useWallet } from '@aptos-labs/wallet-adapter-react';
import { MSafeWalletAdapter } from '@msafe/aptos-wallet-adapter';
import { OKXWallet } from '@okwallet/aptos-wallet-adapter';
import { PontemWallet } from '@pontem/wallet-adapter-plugin';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

const AptosProvider = ({ children }: { children: React.ReactNode }) => {
  const wallets = [new OKXWallet(), new PetraWallet(), new MSafeWalletAdapter(), new PontemWallet()];
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={false}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error) => {
        toast.error(error || 'Unknown wallet error');
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default AptosProvider;

export const useAptosWallet = useWallet;
