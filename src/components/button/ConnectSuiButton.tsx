import React, { useState } from 'react';
import { shortenAddress } from '@src/lib/utils';
import { ConnectModal } from '@suiet/wallet-kit';

import { useSuiWallet } from '../provider/SuiProvider';

const ConnectSuiButton = () => {
  const { connected, disconnect, address } = useSuiWallet();
  const [showModal, setShowModal] = useState(false);

  if (connected) {
    return (
      <button
        onClick={() => {
          disconnect();
          setShowModal(false);
        }}
        className="flex items-center justify-center gap-[10px] rounded-[104px] border border-[#8C8CA6] px-[24px] py-[10px] backdrop-blur-[10px]"
      >
        <span className="text-[14px] font-medium tracking-[-0.15px] text-[#FFFFFF] md:text-[16px]">
          {shortenAddress(String(address))}
        </span>
      </button>
    );
  }

  return (
    <ConnectModal open={showModal} onOpenChange={(open) => setShowModal(open)}>
      <button className="flex items-center justify-center gap-[10px] rounded-[104px] border border-[#8C8CA6] px-[24px] py-[10px] backdrop-blur-[10px]">
        <span className="text-[14px] font-medium tracking-[-0.15px] text-[#FFFFFF] md:text-[16px]">Connect Wallet</span>
      </button>
    </ConnectModal>
  );
};

export default ConnectSuiButton;
