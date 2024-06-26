import { toast } from 'react-toastify';
import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { useAptosWallet } from '@src/components/provider/AptosProvider';
import { aptosClient } from '@src/lib/aptos';
const APTOS_COIN = '0x1::aptos_coin::AptosCoin';

function useTransferAptos() {
  const { account, network, signAndSubmitTransaction } = useAptosWallet();

  const sendNativeCoinByAddress = async (address: string, amount: number) => {
    if (!account) return;
    const transaction: InputTransactionData = {
      data: {
        function: '0x1::coin::transfer',
        typeArguments: [APTOS_COIN],
        functionArguments: [address, amount * 10 ** 8],
      },
    };
    try {
      const commitedTransaction = await signAndSubmitTransaction(transaction);
      const executedTransaction = await aptosClient(network).waitForTransaction({
        transactionHash: commitedTransaction.hash,
      });

      if (executedTransaction.success) {
        return executedTransaction.hash;
      }

      toast.error('Transaction failed');
      return null;
    } catch (error) {
      toast.error(error?.toString() as string);
      console.error('Error sending transaction:', error);
      return null;
    }
  };

  return { sendNativeCoinByAddress };
}

export default useTransferAptos;
