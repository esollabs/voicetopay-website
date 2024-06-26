import { toast } from 'react-toastify';
import { decodeSuiPrivateKey, SerializedSignature } from '@mysten/sui.js/cryptography';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { genAddressSeed, getZkLoginSignature } from '@mysten/zklogin';
import { useSuiWallet } from '@src/components/provider/SuiProvider';
import { useWalletProvider, WalletEnum } from '@src/components/provider/WalletProvider';
import { useZkLogin } from '@src/components/provider/ZkLoginSuiProvider';
import { getSuiProvider } from '@src/lib/sui';

function useTransferSui() {
  const { address, signAndExecuteTransactionBlock } = useSuiWallet();
  const { wallet } = useWalletProvider();
  const { account } = useZkLogin();
  const suiClient = getSuiProvider();

  const sendNativeCoinByAddress = async (address: string, amount: number) => {
    if (wallet === WalletEnum.SUI) {
      return signAndExecuteTransactionWithZkLogin(address, amount);
    }
  };

  const getAddressByDomainName = (domainName: string) => {
    let address = null;
    if (domainName.toLocaleLowerCase() === 'alexa' || domainName.toLocaleLowerCase() === 'alexa.sui') {
      address = '0xb859433f81a706f73bce8c4fb05182752ff6dfaae85de84b6d95043b61f84bc5';
    } else if (domainName.toLocaleLowerCase() === 'tom' || domainName.toLocaleLowerCase() === 'tom.sui') {
      address = '0x88aaf1b7884900f9081880899878f266b8f2decfd4b7c5f227b81a75e13951e6';
    }

    return address;
  };

  // eslint-disable-next-line unused-imports/no-unused-vars
  const signAndExecuteTransactionWithSuiWallet = async (amount: number, addressTo: string) => {
    if (!address) {
      return;
    }

    const amountBigNumber = Number(amount) * Math.pow(10, 9);

    try {
      // coin transfer
      const keypair = new Ed25519Keypair();
      const txb = new TransactionBlock();

      const [coin] = txb.splitCoins(txb.gas, [amountBigNumber]);
      txb.transferObjects([coin], addressTo);

      const tx = await signAndExecuteTransactionBlock({
        transactionBlock: txb,
        signer: keypair,
      } as any);

      return tx;
    } catch (error) {
      console.log('log check error', error);
      toast.error('Could not handle payment !!');
    }
  };

  const signAndExecuteTransactionWithZkLogin = async (address: string, amount: number) => {
    if (!account) {
      toast.error('Account not found');
      return;
    }

    const amountBigNumber = Number(amount) * Math.pow(10, 9);
    const addressTo = address;

    try {
      // coin transfer
      const txb = new TransactionBlock();

      const [coin] = txb.splitCoins(txb.gas, [amountBigNumber]);
      txb.transferObjects([coin], addressTo);
      txb.setSender(account.userAddr);

      const ephemeralKeyPair = keypairFromSecretKey(account.ephemeralPrivateKey);
      const { bytes, signature: userSignature } = await txb.sign({
        client: suiClient,
        signer: ephemeralKeyPair,
      });

      // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience)
      const addressSeed = genAddressSeed(BigInt(account.userSalt), 'sub', account.sub, account.aud).toString();

      // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
      // and the ephemeral signature (userSignature)
      const zkLoginSignature: SerializedSignature = getZkLoginSignature({
        inputs: {
          ...account.zkProofs,
          addressSeed,
        },
        maxEpoch: account.maxEpoch,
        userSignature,
      });

      const tx = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature: zkLoginSignature,
        options: {
          showEffects: true,
        },
      });

      if (tx.effects?.status?.status === 'success') {
        toast.success('Payment successful');
        return tx;
      }

      toast.error(tx.effects?.status.error);
      return null;
    } catch (error) {
      console.log('log check error', error);
      toast.error('Could not handle payment !!');
    }
  };

  function keypairFromSecretKey(privateKeyBase64: string): Ed25519Keypair {
    const keyPair = decodeSuiPrivateKey(privateKeyBase64);
    return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
  }

  function sendNativeCoinByDomain(domainName: string, amount: number) {
    const address = getAddressByDomainName(domainName);

    if (!address) {
      toast.error('Address not found');
      return;
    }

    return sendNativeCoinByAddress(address, amount);
  }

  return {
    sendNativeCoinByAddress,
    sendNativeCoinByDomain,
  };
}

export default useTransferSui;
