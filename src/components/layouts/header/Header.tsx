import { useState } from 'react';
import { toast } from 'react-toastify';
import History from '@src/components/history/History';
import HistoryIcon from '@src/components/icons/history';
import Logo from '@src/components/icons/logo';
import { useClickOutside } from '@src/hooks/useClickOutside';

import ConnectAptosButton from '../../button/ConnectAptosButton';
import ConnectSolanaButton from '../../button/ConnectSolanaButton';
import ZkLoginButton from '../../button/ZkLoginButton';
import { useWalletProvider, WalletEnum } from '../../provider/WalletProvider';

import ChainSelector from './ChainSelector';

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { wallet, address } = useWalletProvider();
  const nodeRef = useClickOutside(() => setOpen(false));

  return (
    <div className="relative z-[2] bg-[rgba(0,0,0,0.2)] backdrop-blur-[10px]">
      <head className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between  px-4 md:px-[120px]">
        <div className="flex cursor-pointer items-center gap-3">
          <Logo />
          <h1 className="silver-text hidden text-base font-medium md:block md:text-2xl">{`Voice To Pay`}</h1>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <ChainSelector />
          <div ref={nodeRef} className="relative">
            <button
              onClick={() => {
                if (address) {
                  setOpen(!open);
                } else {
                  toast.error('Please connect wallet');
                }
              }}
              type="button"
              className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.18)]"
            >
              <HistoryIcon />
            </button>
            {open && (
              <div className="absolute right-0 top-full z-[20] mt-[16px] h-full">
                <History />
              </div>
            )}
          </div>
          {wallet === WalletEnum.SOLANA && <ConnectSolanaButton />}
          {wallet === WalletEnum.SUI && <ZkLoginButton />}
          {wallet === WalletEnum.APTOS && <ConnectAptosButton />}
        </div>
      </head>
    </div>
  );
};

export default Header;
