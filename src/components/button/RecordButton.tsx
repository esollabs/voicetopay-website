import recording from '@assets/imgs/recording.gif';
import Mic from '@assets/svgs/mic.svg';
import Star from '@src/components/icons/star';
import { SizeEnum } from '@src/lib/enum';

const RecordButton = ({
  listening,
  onClick,
  size = SizeEnum.LARGE,
}: {
  listening: boolean;
  onClick?: () => void;
  size?: SizeEnum;
}) => {
  return !listening ? (
    <div
      className={`flex flex-col items-center justify-between ${size === SizeEnum.LARGE && 'gap-12'} ${size === SizeEnum.SMALL && 'gap-4'}`}
    >
      <button
        onClick={onClick}
        className={`relative flex ${size === SizeEnum.LARGE && 'h-[240px] w-[240px] border-[16px] p-[49.922px_71.128px_49.922px_71px]'} ${size === SizeEnum.SMALL && 'h-[80px] w-[80px] border-[2px]'} items-center justify-center rounded-full  border-[rgba(255,255,255,0.24)] bg-[rgba(142,120,170,0.64)] 
        active:opacity-90`}
      >
        <img src={Mic} alt="mic" className="absolute inset-0 h-full w-full" draggable={false} />
      </button>
      <span
        className={`${size === SizeEnum.LARGE && 'text-[32px] leading-[32px]'} ${size === SizeEnum.SMALL && 'text-sm'} tracking-[-0.15px] text-[#B8BECC]`}
      >
        Tap to command
      </span>
    </div>
  ) : (
    <div className={`flex flex-col items-center justify-between`}>
      <div
        className={`relative ${size === SizeEnum.LARGE && 'h-[440px] w-[568px]'}  ${size === SizeEnum.SMALL && 'w-[200px]'} overflow-hidden rounded-full`}
      >
        <img
          src={recording}
          alt="recording"
          className={`h-full w-full object-cover mix-blend-plus-lighter`}
          draggable={false}
        />
        <div className="absolute left-1/2 top-1/2 mt-4 -translate-x-1/2 -translate-y-1/2">
          <Star size={size} />
        </div>
      </div>
      <span
        className={`${size === SizeEnum.LARGE && 'mb-[80px] text-[32px] leading-[32px] '} tracking-[-0.15px] text-[#B8BECC] ${size === SizeEnum.SMALL && '-translate-y-4 text-sm'}`}
      >
        Say something
      </span>
    </div>
  );
};

export default RecordButton;
