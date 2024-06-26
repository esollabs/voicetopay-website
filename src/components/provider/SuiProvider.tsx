import React from 'react';
import { useWallet, WalletProvider } from '@suiet/wallet-kit';

import '@suiet/wallet-kit/style.css';

const SuiProvider = ({ children }: { children: React.ReactNode }) => {
  return <WalletProvider autoConnect={false}> {children}</WalletProvider>;
};

export const useSuiWallet = useWallet;

export default SuiProvider;
