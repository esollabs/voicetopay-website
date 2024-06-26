import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import arrowDownIcon from '@src/assets/svgs/arrow-down.svg';
import { shortenAddress } from '@src/lib/utils';

import WalletInfoPopover from '../layouts/header/WalletInfoPopover';

const ConnectSolanaButton = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const onConnectWallet = () => {
    if (publicKey) {
      setIsOpenPopup(true);
      return;
    }

    setVisible(true);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center gap-[10px] rounded-[104px] border border-[#8C8CA6] px-[24px] py-[10px] backdrop-blur-[10px]"
        onClick={onConnectWallet}
      >
        <span className="text-[14px] font-medium tracking-[-0.15px] text-[#FFFFFF] md:text-[16px]">
          {publicKey ? <>{shortenAddress(publicKey.toBase58())}</> : 'Connect Wallet'}
        </span>

        {publicKey && <img src={arrowDownIcon} alt="arrow down" />}
      </button>
      {isOpenPopup && (
        <WalletInfoPopover
          address={publicKey?.toBase58() || ''}
          disconnect={disconnect}
          isOpen={isOpenPopup}
          onClose={() => setIsOpenPopup(false)}
        />
      )}
    </div>
  );
};

export default ConnectSolanaButton;
