import { useState } from 'react';
import arrowDownIcon from '@src/assets/svgs/arrow-down.svg';
import { shortenAddress } from '@src/lib/utils';

import WalletInfoPopover from '../layouts/header/WalletInfoPopover';
import { useZkLogin } from '../provider/ZkLoginSuiProvider';

const ZkLoginButton = () => {
  const { account, openLoginModal, logout, isLoggingIn } = useZkLogin();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const onLoginWithZkLogin = () => {
    if (account) {
      setIsOpenPopup(true);
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onLoginWithZkLogin}
        className="flex items-center justify-center gap-[10px] rounded-[104px] border border-[#8C8CA6] px-[24px] py-[10px] backdrop-blur-[10px]"
      >
        <span className="text-[14px] font-medium tracking-[-0.15px] text-[#FFFFFF] md:text-[16px]">
          {isLoggingIn ? 'Logging in...' : ''}
          {account ? shortenAddress(account.userAddr) : 'Connect Wallet'}
        </span>
        {account && <img src={arrowDownIcon} alt="arrow down" />}
      </button>
      {isOpenPopup && (
        <WalletInfoPopover
          address={account?.userAddr || ''}
          disconnect={logout}
          isOpen={isOpenPopup}
          onClose={() => setIsOpenPopup(false)}
        />
      )}
    </div>
  );
};

export default ZkLoginButton;
