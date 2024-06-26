import { useCallback, useState } from 'react';
import {
  AnyAptosWallet,
  getAptosConnectWallets,
  partitionWallets,
  useWallet,
  WalletItem,
} from '@aptos-labs/wallet-adapter-react';
import arrowDownIcon from '@src/assets/svgs/arrow-down.svg';
import { shortenAddress } from '@src/lib/utils';

import WalletInfoPopover from '../layouts/header/WalletInfoPopover';
import { useAptosWallet } from '../provider/AptosProvider';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { DialogHeader } from '../ui/Dialog';

const ConnectAptosButton = () => {
  const { account, connected, disconnect } = useAptosWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShowWalletInfo, setIsShowWalletInfo] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  if (connected) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            setIsShowWalletInfo(true);
          }}
          className="flex items-center justify-center gap-[10px] rounded-[104px] border border-[#8C8CA6] px-[24px] py-[10px] backdrop-blur-[10px]"
        >
          <span className="text-[14px] font-medium tracking-[-0.15px] text-[#FFFFFF] md:text-[16px]">
            {shortenAddress(account?.address || '')}
          </span>
          <img src={arrowDownIcon} alt="arrow down" />
        </button>
        {isShowWalletInfo && (
          <WalletInfoPopover
            address={account?.address || ''}
            disconnect={disconnect}
            isOpen={isShowWalletInfo}
            onClose={() => setIsShowWalletInfo(false)}
          />
        )}
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center justify-center gap-[10px] rounded-[104px] border border-[#8C8CA6] px-[24px] py-[10px] text-white backdrop-blur-[10px]"
          onClick={() => setIsDialogOpen(true)}
        >
          <span className="text-[14px] font-medium tracking-[-0.15px] text-[#FFFFFF] md:text-[16px]">
            Connect Wallet
          </span>
        </button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} />
    </Dialog>
  );
};

export default ConnectAptosButton;

type ConnectWalletDialogProps = {
  close: () => void;
};

function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { wallets = [] } = useWallet();

  const { aptosConnectWallets, otherWallets } = getAptosConnectWallets(wallets);
  const { defaultWallets, moreWallets } = partitionWallets(otherWallets);

  return (
    <DialogContent className="max-h-screen w-[400px] overflow-auto bg-white">
      <DialogHeader className="flex flex-col items-center">
        <DialogTitle className="flex flex-col text-center leading-snug">
          <span>Aptos Connect Wallet</span>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-3 pt-3">
        {aptosConnectWallets.map((wallet) => (
          <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}

        {defaultWallets.map((wallet) => (
          <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}

        {moreWallets.map((wallet) => (
          <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}
      </div>
    </DialogContent>
  );
}

type WalletRowProps = {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
};

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex w-full cursor-pointer items-center justify-center rounded-lg px-3 py-2 hover:bg-slate-100"
    >
      <WalletItem.ConnectButton asChild>
        <div className="flex w-full items-center gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </div>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}
