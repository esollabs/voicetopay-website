import React, { useMemo } from 'react';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// import the styles
import '@solana/wallet-adapter-react-ui/styles.css';

export default function SolanaProvider({ children }: { children: React.ReactNode }) {
  // you can use Mainnet, Devnet or Testnet here
  const isMainnet = Number(import.meta.env.VITE_IS_MAINNET) === 1;
  const solNetwork = isMainnet ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  // initialise all the wallets you want to use
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new BackpackWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export const useSolanaWallet = useWallet;
