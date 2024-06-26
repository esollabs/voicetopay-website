import { MessageEnum } from '@src/lib/enum';

import { useVoiceChat } from '../provider/VoiceChatProvider';

import MessageBlock from './MessageBlock';

const VoiceChatContainer = () => {
  const { messages, isBotMessageLoading } = useVoiceChat();
  return (
    <div className="chat_voice-container flex h-full w-full flex-col gap-[32px] overflow-y-auto pb-10">
      {messages.length > 0 &&
        messages.map((message, index) => {
          return (
            <MessageBlock
              index={index}
              key={index}
              content={message.content}
              type={message.type}
              additionData={message?.additionData}
            />
          );
        })}

      {isBotMessageLoading && <MessageBlock index={messages.length} type={MessageEnum.BOT} content={''} />}
    </div>
  );
};

export default VoiceChatContainer;
