import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import aptosImg from '@src/assets/imgs/aptos.png';
import solanaImg from '@src/assets/imgs/solana.png';
import suiImg from '@src/assets/imgs/sui.png';
import arrowDownIcon from '@src/assets/svgs/arrow-down.svg';
import { useClickOutside } from '@src/hooks/useClickOutside';

import { useWalletProvider, WalletEnum } from '../../provider/WalletProvider';

const options = {
  [WalletEnum.SOLANA]: {
    type: WalletEnum.SOLANA,
    label: 'Solana',
    img: solanaImg,
  },
  [WalletEnum.SUI]: {
    type: WalletEnum.SUI,
    label: 'SUI',
    img: suiImg,
  },
  [WalletEnum.APTOS]: {
    type: WalletEnum.APTOS,
    label: 'Aptos',
    img: aptosImg,
  },
};

const ChainSelector = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { wallet, setWallet } = useWalletProvider();
  const [, setSearchParams] = useSearchParams();
  const nodeRef = useClickOutside(() => {
    setIsOpenPopup(false);
  });

  return (
    <div ref={nodeRef} className="relative">
      <div
        className="flex cursor-pointer items-center gap-[10px] rounded-[104px] border-l border-solid border-l-[rgba(255,255,255,0.30)] bg-[linear-gradient(90deg,rgba(30,30,30,0.50)_0%,rgba(85,85,85,0.50)_100%)] px-4 py-[10px] backdrop-blur-[10px]"
        onClick={() => {
          setIsOpenPopup(!isOpenPopup);
        }}
      >
        <img
          src={options[wallet].img}
          alt="sui img"
          className="flex h-[24px] w-[24px] items-center justify-center object-cover"
        />
        <img src={arrowDownIcon} alt="arrow down" className="h-[24px] w-[24px] object-cover" />
      </div>
      {isOpenPopup && (
        <div className="absolute  left-0 top-[calc(100%+10px)] z-[10] flex w-[180px] cursor-pointer flex-col gap-2 overflow-hidden rounded-3xl bg-[#1C1C1C] p-3">
          {Object.values(options).map((option, index) => (
            <div
              onClick={() => {
                setWallet(option.type);
                //add query param ?chain=option.type
                setSearchParams({ chain: option.type });
                setIsOpenPopup(false);
              }}
              key={index}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-[rgba(255,255,255,0.10)]"
            >
              <img className=" h-[24px] w-[24px] object-cover" src={option.img} alt="solana" />
              <span className="text-sm text-[#FFF]">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainSelector;
