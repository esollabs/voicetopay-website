import arrowTopRightSvg from '@src/assets/svgs/arrow-top-right.svg';
import { convertTime } from '@src/lib/utils';

type HistoryItemProps = {
  message: string;
  amount: number;
  asset: string;
  createdAt: string;
};

const HistoryItem = ({ message, createdAt, amount, asset }: HistoryItemProps) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg p-[8px_16px_8px_8px] hover:bg-[rgba(255,255,255,0.10)]">
      <div className="flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] p-2">
        <img src={arrowTopRightSvg} alt="arrow" />
      </div>
      <div className="flex w-full flex-col items-start gap-1">
        <span className="text-[16px] font-medium text-[#FFF]">{message}</span>
        <span className="text-[16px] text-[#868686]">{convertTime(createdAt)}</span>
      </div>
      <div className="whitespace-nowrap text-[16px] font-medium uppercase text-[#19FB9B]">
        -{amount} {asset}
      </div>
    </div>
  );
};

export default HistoryItem;
