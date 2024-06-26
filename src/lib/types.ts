import { MessageEnum } from './enum';

export type MessageType = {
  content: string;
  additionData?: TransactionType;
  type: MessageEnum;
  index?: number;
};

export type TransactionType = {
  action: string;
  amount: number;
  asset: string;
  receiver: string;
  domainName: string;
};

export type ParsedTokenAccount = {
  publicKey: string;
  mintKey: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
  symbol?: string;
  name?: string;
  logo?: string;
  isNativeAsset?: boolean;
};

export type HistoryTransactionType = {
  domainName: string;
  amount: number;
  action: string;
  asset: string;
  message: string;
  createdAt: string;
};
