import axiosClient from './axios-client';

export const voiceChatService = {
  initVoiceChat: async ({ message, address, chain }: { message: string; address: string; chain: string }) => {
    const response = await axiosClient.post('/init', {
      message,
      address,
      chain,
    });
    return response.data;
  },
  communicate: async ({ chatId, message, chain }: { chatId: string; message: string; chain: string }) => {
    const response = await axiosClient.post('/communicate', { chatId, message, chain });
    return response.data;
  },

  history: async ({ address }: { address: string }) => {
    const response = await axiosClient.get(`/history/${address}`);
    return response.data;
  },

  enhanceTextInput: async ({ text, chain }: { text: string; chain: string }) => {
    const response = await axiosClient.post('/enhance_text', { message: text, chain });
    return response.data;
  },
};
