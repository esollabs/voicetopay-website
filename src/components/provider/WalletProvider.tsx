import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAptosWallet } from './AptosProvider';
import { useSolanaWallet } from './SolanaProvider';
import { useZkLogin } from './ZkLoginSuiProvider';

type WalletContextType = {
  wallet: WalletEnum;
  address: string;
  setWallet: (wallet: WalletEnum) => void;
  onDisconnect: () => void;
};

export enum WalletEnum {
  SUI = 'sui',
  SOLANA = 'solana',
  APTOS = 'aptos',
}

const WalletContext = createContext<WalletContextType | null>(null);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>('');
  const { connected: solanaConnected, publicKey, disconnect: solanaDisconnect } = useSolanaWallet();
  const { account: zkLoginAccount, logout: suiDisconnect } = useZkLogin();
  const { account: aptosAccount, connected: aptosConnected, disconnect: aptosDisconnect } = useAptosWallet();
  const [searchParams] = useSearchParams();
  const chain = searchParams.get('chain') as WalletEnum;
  const [currentWallet, setCurrentWallet] = useState<WalletEnum>(chain || WalletEnum.SUI);

  // Change wallet
  const onChangeWallet = (wallet: WalletEnum) => {
    setCurrentWallet(wallet);
  };

  // Disconnect wallet
  const onDisconnect = () => {
    switch (currentWallet) {
      case WalletEnum.SOLANA:
        solanaDisconnect();
        break;
      case WalletEnum.SUI:
        suiDisconnect();
        break;
      case WalletEnum.APTOS:
        aptosDisconnect();
        break;
      default:
        break;
    }
  };

  // Set address when wallet connected
  useEffect(() => {
    switch (currentWallet) {
      case WalletEnum.SOLANA:
        if (solanaConnected) {
          setAddress(publicKey?.toBase58() || '');
          return;
        }
        setAddress('');
        break;
      case WalletEnum.SUI:
        if (zkLoginAccount) {
          setAddress(zkLoginAccount.userAddr);
          return;
        }
        setAddress('');
        break;
      case WalletEnum.APTOS:
        if (aptosConnected) {
          setAddress(aptosAccount?.address || '');
          return;
        }
        setAddress('');
        break;
      default:
        break;
    }
  }, [solanaConnected, zkLoginAccount, currentWallet, aptosConnected]);

  return (
    <WalletContext.Provider
      value={{
        address,
        wallet: currentWallet,
        setWallet: onChangeWallet,
        onDisconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

export const useWalletProvider = () => {
  const context = useContext(WalletContext as React.Context<WalletContextType>);
  if (!context) {
    throw new Error('useWalletProvider must be used within a WalletProvider');
  }
  return context;
};
