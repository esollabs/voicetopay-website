import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from 'react-toastify';
import { useTransferSolana } from '@src/hooks/useTransferSolana';
import useTransferSui from '@src/hooks/useTransferSui';
import { VOICE_CHAT_CONTAINER } from '@src/lib/dom';
import { MessageEnum } from '@src/lib/enum';
import { BONK_ADDRESS, BONK_DECIMALS, USDC_ADDRESS, USDC_DECIMALS } from '@src/lib/solana';
import { MessageType } from '@src/lib/types';
import { voiceChatService } from '@src/service/voice-chat.service';

import { useWalletProvider, WalletEnum } from './WalletProvider';

type VoiceChatContextType = {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  currentMessage: MessageType | null;
  isStart: boolean;
  listening: boolean;
  onRecording: () => void;
  stopRecording: () => void;
  isBotSpeaking: boolean;
  isBotMessageLoading: boolean;
  isTransactionLoading: boolean;
  isTransactionSuccess: boolean;
};

const voiceChatContext = createContext<VoiceChatContextType | null>(null);

const VoiceChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isStart, setIsStart] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentMessage, setCurrentMessage] = useState<MessageType | null>(null);
  const { listening, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const audioRef = useRef<any>(null);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [chatId, setChatId] = useState<string>('');
  const { sendTokenByDomain: transferSolanaToken, sendNativeCoinByDomain: transferSolanaCoin } = useTransferSolana();
  const { sendNativeCoinByDomain: transferSuiCoin } = useTransferSui();
  const { wallet: chain, address } = useWalletProvider();

  const onPlayTickAudio = () => {
    const audio = new Audio('src/assets/audio/tick.mp3');
    audio.play();
  };

  useEffect(() => {
    if (currentMessage) {
      setMessages((prev) => [...prev, currentMessage]);

      //auto scroll bottom
      setTimeout(() => {
        const chatContainer = document.querySelector(VOICE_CHAT_CONTAINER);
        chatContainer?.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }

    if (currentMessage?.type === MessageEnum.OWN) {
      // Call API to get response

      if (!isStart) {
        //call api init chat
        initVoiceChat(currentMessage.content);
        setIsStart(true);
        return; // stop here
      }

      onCommunicate(currentMessage.content);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (finalTranscript) {
      setCurrentMessage({
        content: finalTranscript,
        type: MessageEnum.OWN,
        index: messages.length + 1,
      });
      resetTranscript();
    }
  }, [finalTranscript]);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  //auto recording when bot finish speaking
  useEffect(() => {
    if (!isBotSpeaking && isStart && !currentMessage?.additionData) {
      onRecording();
    }
  }, [isBotSpeaking]);

  const onRecording = () => {
    SpeechRecognition.startListening();
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  const initVoiceChat = async (message: string) => {
    if (!address) {
      toast.error('Please connect wallet');
      return;
    }

    setIsApiLoading(true);
    const res = await voiceChatService.initVoiceChat({ message, address, chain: chain });
    setCurrentMessage({
      content: res?.data.text,
      type: MessageEnum.BOT,
      index: messages.length + 1,
    });

    setIsApiLoading(false);
    onSpeedText(res?.data?.mp3.data);
    setChatId(res?.data?.chatId);
  };

  const onCommunicate = async (message: string) => {
    setIsApiLoading(true);
    const res = await voiceChatService.communicate({ chatId: chatId, message, chain: chain });

    if (res?.data.chatId !== chatId) {
      setChatId(res?.data.chatId);
    }

    setCurrentMessage({
      content: res?.data.text,
      type: MessageEnum.BOT,
      additionData: res?.data?.additionData,
      index: messages.length + 1,
    });

    // on speed text
    setIsApiLoading(false);
    onSpeedText(res?.data?.mp3.data);

    // send transaction
    if (res?.data?.additionData) {
      if (!chain) {
        toast.error('Please connect wallet');
        return;
      }

      // check message is transaction
      const data = res?.data?.additionData;
      if (Number(data?.amount) <= 0) return;

      try {
        setIsTransactionLoading(true);
        let hash = null;
        switch (chain) {
          // transfer solana
          case WalletEnum.SOLANA:
            switch (data?.asset.toLowerCase()) {
              case 'sol': {
                const tx = await transferSolanaCoin(data.domainName, Number(data.amount));
                hash = tx;
                break;
              }
              case 'usdc': {
                const tx = await transferSolanaToken(data.domainName, USDC_ADDRESS, Number(data.amount), USDC_DECIMALS);
                hash = tx;
                break;
              }
              case 'bonk': {
                const tx = await transferSolanaToken(data.domainName, BONK_ADDRESS, Number(data.amount), BONK_DECIMALS);
                hash = tx;
                break;
              }
              default:
                break;
            }
            break;
          // transfer sui
          case WalletEnum.SUI:
            switch (data?.asset.toLowerCase()) {
              case 'sui': {
                const tx = await transferSuiCoin(data.domainName, Number(data.amount));
                hash = tx;
                break;
              }
              default:
                break;
            }
            break;
          default:
            break;
        }

        if (hash) {
          onPlayTickAudio();
          setIsTransactionSuccess(true);
          return;
        }

        setIsTransactionSuccess(false);
      } catch (error) {
        setIsTransactionSuccess(false);
      } finally {
        setIsTransactionLoading(false);
      }
    }
  };

  const onSpeedText = useCallback(async (url: number[]) => {
    try {
      await onPlayAudio(url);
    } catch (error) {
      console.log('error onSpeedText: ', error);
    }
  }, []);

  const onPlayAudio = (url: number[]) => {
    if (!url) {
      setIsBotSpeaking(false);
      return;
    }

    return new Promise((resolve, reject) => {
      setIsBotSpeaking(true);
      audioRef.current.src = url;
      audioRef.current.play();
      audioRef.current.onended = () => {
        setIsBotSpeaking(false);
        resolve(true);
      };

      const audioBlob = new Blob([new Uint8Array(url)], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      audioRef.current.play();
      if (audioRef.current.paused) {
        setIsBotSpeaking(false);
      }
      audioRef.current.onerror = () => {
        reject(false);
      };
    });
  };

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-red-700">Browser doesn't support speech recognition.</span>;
  }

  return (
    <voiceChatContext.Provider
      value={{
        messages,
        setMessages,
        currentMessage,
        isStart,
        listening,
        onRecording,
        stopRecording,
        isBotSpeaking,
        isBotMessageLoading: isApiLoading,
        isTransactionLoading,
        isTransactionSuccess,
      }}
    >
      {children}
    </voiceChatContext.Provider>
  );
};

export default VoiceChatProvider;

export const useVoiceChat = () => {
  const context = useContext(voiceChatContext as React.Context<VoiceChatContextType>);

  if (!context) {
    throw new Error('useVoiceChat must be used within a VoiceChatProvider');
  }

  return context;
};
