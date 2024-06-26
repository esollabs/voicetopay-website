import successIcon from '@assets/imgs/success.png';
import bot from '@assets/svgs/bot.svg';
import processing from '@assets/svgs/processing.svg';
import right from '@assets/svgs/right.svg';
import you from '@assets/svgs/you.svg';
import { MessageEnum } from '@src/lib/enum';
import { TransactionType } from '@src/lib/types';

import { useVoiceChat } from '../provider/VoiceChatProvider';

import TextHighlighter from './TextHighlighter';

const OwnMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex items-start gap-3 md:gap-6">
      <img src={you} alt="you" />
      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-[#FFFFFF] md:text-[20px]">You</span>
        <TextHighlighter text={content} />
      </div>
    </div>
  );
};

const BotMessage = ({
  content,
  additionData,
  index,
}: {
  content: string;
  additionData?: TransactionType;
  index: number;
}) => {
  const { isBotSpeaking, isBotMessageLoading, currentMessage } = useVoiceChat();

  return (
    <div className="flex items-start gap-3 md:gap-6">
      <div className="flex flex-col items-end justify-end gap-4">
        <div className="flex items-center justify-end gap-2">
          {isBotSpeaking && currentMessage?.index === index && (
            <div className="flex items-center justify-center">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          )}
          <span className="text-right text-sm font-medium text-[#FFFFFF] md:text-[20px]">{`{Voice to Pay}`}</span>
        </div>
        {isBotMessageLoading && currentMessage?.index === index ? (
          <div className="wavy -translate-y-2">
            <span style={{ '--i': 1 } as React.CSSProperties}>.</span>
            <span style={{ '--i': 2 } as React.CSSProperties}>.</span>
            <span style={{ '--i': 3 } as React.CSSProperties}>.</span>
          </div>
        ) : (
          <TextHighlighter text={content} />
        )}
        {additionData && <TransactionMessage additionData={additionData} messageIndex={index} />}
      </div>
      <img src={bot} alt="you" />
    </div>
  );
};

const TransactionMessage = ({
  additionData,
  messageIndex,
}: {
  additionData: TransactionType;
  messageIndex: number;
}) => {
  const { currentMessage, isTransactionLoading, isTransactionSuccess } = useVoiceChat();

  return (
    <div className="flex w-[257px] flex-col justify-end gap-2 rounded-3xl border border-[#4F4F4F] bg-[rgba(85,85,85,0.21)] px-6 py-3 backdrop-blur-[2px] md:w-[419px] md:p-6">
      <div className="flex flex-col">
        <div className="text-sm text-[#8C8CA6] md:text-2xl">Send To</div>
        <div className="text-xl text-[#9945FF] md:text-[32px]">{additionData?.domainName}</div>
      </div>
      <div className="text-[32px] font-medium text-white md:text-5xl">
        {additionData?.amount} {additionData?.asset}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {!isTransactionSuccess && isTransactionLoading && currentMessage?.index === messageIndex && (
            <>
              <img src={processing} className="h-[20px] w-[20px] animate-spin md:h-[24px] md:w-[24px]" alt="" />{' '}
              <div className="text-base text-[#FFF] md:text-2xl">Processing...</div>
            </>
          )}
          {isTransactionSuccess && currentMessage?.index === messageIndex && (
            <>
              <img src={successIcon} className="h-[20px] w-[20px] md:h-[30px] md:w-[30px]" />{' '}
              <div className="text-base text-[#FFF] md:text-2xl">Success</div>
            </>
          )}
          {!isTransactionLoading && !isTransactionSuccess && currentMessage?.index === messageIndex && (
            <div className="text-base text-[#FF5959] md:text-2xl">Failed</div>
          )}
        </div>
        <img src={right} className="h-[20px] w-[20px] md:h-[24px] md:w-[24px]" alt="" />
      </div>
    </div>
  );
};

const MessageBlock = ({
  index,
  content,
  type,
  additionData,
}: {
  index: number;
  content: string;
  additionData?: TransactionType;
  type: MessageEnum;
}) => {
  return (
    <>
      {type === MessageEnum.OWN ? (
        <div className={`flex w-full justify-start `}>
          <OwnMessage content={content} />
        </div>
      ) : (
        <div className={`flex w-full justify-end `}>
          <BotMessage index={index} content={content} additionData={additionData} />
        </div>
      )}
    </>
  );
};

export default MessageBlock;
