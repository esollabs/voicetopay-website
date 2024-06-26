import { useClickOutside } from '@src/hooks/useClickOutside';
import { useClipboard } from '@src/hooks/useClipBoard';

type Props = {
  address: string;
  disconnect: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const WalletInfoPopover = (props: Props) => {
  const { address, disconnect, onClose } = props;
  const { copy, copied } = useClipboard();
  const nodeRef = useClickOutside(() => {
    onClose();
  });

  return (
    <div
      ref={nodeRef}
      className="absolute left-0 top-[calc(100%+10px)] z-[10] flex w-[180px] cursor-pointer flex-col gap-2 overflow-hidden rounded-3xl bg-[#1C1C1C] p-3"
    >
      <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-[rgba(255,255,255,0.10)]">
        <span
          className="text-sm text-white"
          onClick={() => {
            copy(address);
          }}
        >
          {copied ? 'Copied' : 'Copy Address'}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-[rgba(255,255,255,0.10)]">
        <span
          className="text-sm text-white"
          onClick={() => {
            disconnect();
            onClose();
          }}
        >
          Disconnect
        </span>
      </div>
    </div>
  );
};

export default WalletInfoPopover;
