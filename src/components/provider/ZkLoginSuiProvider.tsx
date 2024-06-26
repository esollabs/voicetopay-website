import React, { createContext, useEffect, useState } from 'react';
import googleImg from '@assets/imgs/google.png';
import twitchImg from '@assets/imgs/twitch.png';
import { decodeSuiPrivateKey } from '@mysten/sui.js/cryptography';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { generateNonce, generateRandomness, getExtendedEphemeralPublicKey, jwtToAddress } from '@mysten/zklogin';
import { isLocalhost } from '@polymedia/webutils';
import { getSuiProvider } from '@src/lib/sui';
import { zkLoginConfig } from '@src/lib/zklogin';
import { jwtDecode } from 'jwt-decode';

const ZkLoginContext = createContext<ZkLoginContextType | null>(null);
const setupDataKey = 'zklogin-demo.setup';
const accountDataKey = 'zklogin-demo.accounts';

/* Types */
const MAX_EPOCH = 2;
type OpenIdProvider = 'Google' | 'Twitch' | 'Facebook';

type SetupData = {
  provider: OpenIdProvider;
  maxEpoch: number;
  randomness: string;
  ephemeralPrivateKey: string;
};

type AccountData = {
  provider: OpenIdProvider;
  userAddr: string;
  zkProofs: any;
  ephemeralPrivateKey: string;
  userSalt: string;
  sub: string;
  aud: string;
  maxEpoch: number;
};

type ZkLoginContextType = {
  isLoggingIn: boolean;
  login: (provider: OpenIdProvider) => void;
  logout: () => void;
  account: AccountData | null;
  openIdProviders: OpenIdProvider[];
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

const ZkLoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountData | null>(loadAccount());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const suiClient = getSuiProvider();

  useEffect(() => {
    completeZkLogin();
  }, []);

  async function beginZkLogin(provider: OpenIdProvider) {
    setIsLoggingIn(true);

    // Create a nonce
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

    // Save data to session storage so completeZkLogin() can use it after the redirect
    saveSetupData({
      provider,
      maxEpoch,
      randomness: randomness.toString(),
      ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
    });

    // Start the OAuth flow with the OpenID provider
    const urlParamsBase = {
      nonce: nonce,
      redirect_uri: window.location.origin,
      response_type: 'id_token',
      scope: 'openid',
    };

    let loginUrl: string;
    switch (provider) {
      case 'Google': {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: zkLoginConfig.CLIENT_ID_GOOGLE,
        });
        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`;
        break;
      }
      case 'Twitch': {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: zkLoginConfig.CLIENT_ID_TWITCH,
          force_verify: 'true',
          lang: 'en',
          login_type: 'login',
        });
        loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;
        break;
      }
      case 'Facebook': {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: zkLoginConfig.CLIENT_ID_FACEBOOK,
        });
        loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?${urlParams.toString()}`;
        break;
      }
    }

    window.location.replace(loginUrl);
  }

  async function completeZkLogin() {
    const urlFragment = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(urlFragment);
    const jwt = urlParams.get('id_token');

    if (!jwt) {
      return;
    }

    // remove the URL fragment
    window.history.replaceState(null, '', window.location.pathname);

    // decode the JWT
    const jwtPayload = jwtDecode(jwt);
    if (!jwtPayload.sub || !jwtPayload.aud) {
      console.warn('[completeZkLogin] missing jwt.sub or jwt.aud');
      return;
    }

    const userSalt = '12345678901234567890123456789012';

    // === Get a Sui address for the user ===
    // https://docs.sui.io/concepts/cryptography/zklogin#get-the-users-sui-address

    const userAddr = jwtToAddress(jwt, userSalt);

    // === Load and clear the data which beginZkLogin() created before the redirect ===
    const setupData = loadSetupData();
    if (!setupData) {
      console.warn('[completeZkLogin] missing session storage data');
      return;
    }
    clearSetupData();
    if (account && userAddr === account.userAddr) {
      console.warn(`[completeZkLogin] already logged in with this ${setupData.provider} account`);
      return;
    }

    // === Get the zero-knowledge proof ===
    // https://docs.sui.io/concepts/cryptography/zklogin#get-the-zero-knowledge-proof

    const ephemeralKeyPair = keypairFromSecretKey(setupData.ephemeralPrivateKey);
    const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
    const payload = JSON.stringify(
      {
        maxEpoch: setupData.maxEpoch,
        jwtRandomness: setupData.randomness,
        extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(ephemeralPublicKey),
        jwt,
        salt: userSalt.toString(),
        keyClaimName: 'sub',
      },
      null,
      2
    );

    const zkProofs = await fetch(zkLoginConfig.URL_ZK_PROVER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
      .then((res) => {
        console.debug('[completeZkLogin] ZK proving service success');
        return res.json();
      })
      .catch((error: unknown) => {
        console.warn('[completeZkLogin] ZK proving service error:', error);
        return null;
      })
      .finally(() => {
        setIsLoggingIn(false);
      });

    if (!zkProofs) {
      return;
    }

    // === Save data to session storage so sendTransaction() can use it ===
    saveAccount({
      provider: setupData.provider,
      userAddr,
      zkProofs,
      ephemeralPrivateKey: setupData.ephemeralPrivateKey,
      userSalt: userSalt.toString(),
      sub: jwtPayload.sub,
      aud: typeof jwtPayload.aud === 'string' ? jwtPayload.aud : jwtPayload.aud[0],
      maxEpoch: setupData.maxEpoch,
    });
  }

  /**
   * Create a keypair from a base64-encoded secret key
   */
  function keypairFromSecretKey(privateKeyBase64: string): Ed25519Keypair {
    const keyPair = decodeSuiPrivateKey(privateKeyBase64);
    return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
  }

  /* Session storage */

  function saveSetupData(data: SetupData) {
    sessionStorage.setItem(setupDataKey, JSON.stringify(data));
  }

  function loadSetupData(): SetupData | null {
    const dataRaw = sessionStorage.getItem(setupDataKey);
    if (!dataRaw) {
      return null;
    }
    const data: SetupData = JSON.parse(dataRaw);
    return data;
  }

  function clearSetupData(): void {
    sessionStorage.removeItem(setupDataKey);
  }

  function saveAccount(account: AccountData): void {
    const newAccount = account;
    sessionStorage.setItem(accountDataKey, JSON.stringify(newAccount));
    setAccount(newAccount);
  }

  function loadAccount(): AccountData | null {
    const dataRaw = sessionStorage.getItem(accountDataKey);

    if (!dataRaw) {
      return null;
    }
    const data: AccountData = JSON.parse(dataRaw);
    return data;
  }

  function clearState(): void {
    sessionStorage.clear();
    setAccount(null);
  }

  function openLoginModal() {
    setIsOpenLoginModal(true);
  }

  function closeLoginModal() {
    setIsOpenLoginModal(false);
  }

  const openIdProviders: OpenIdProvider[] = isLocalhost() ? ['Google', 'Twitch'] : ['Google', 'Twitch'];

  return (
    <>
      <ZkLoginContext.Provider
        value={{
          account: account,
          login: beginZkLogin,
          logout: clearState,
          isLoggingIn: isLoggingIn,
          openIdProviders: openIdProviders,
          openLoginModal: openLoginModal,
          closeLoginModal: closeLoginModal,
        }}
      >
        {children}
      </ZkLoginContext.Provider>

      {isOpenLoginModal && (
        <div className="fixed inset-0 z-10 flex">
          <div
            onClick={() => closeLoginModal()}
            className="absolute inset-0 bg-[rgba(244,244,244,0.30)] backdrop-blur-[10px]"
          ></div>
          <div className="z-20 m-auto flex h-[316px] w-[382px] flex-col items-center gap-5 rounded-3xl bg-[#FFFFFF] p-10">
            <div className=" w-full cursor-pointer text-right text-lg font-semibold">
              <span className="rounded-xl p-2 text-[#3B3B3B]" onClick={() => closeLoginModal()}>
                🗙
              </span>
            </div>
            <h2 className="text-center text-lg font-semibold capitalize text-[#3B3B3B]">
              Sign in with <br /> your preferred service
            </h2>

            <div className="flex w-full justify-center gap-4">
              {openIdProviders.map((provider) => (
                <button
                  className="rounded-xl bg-[#EDF5FF] p-4"
                  onClick={() => {
                    beginZkLogin(provider);
                  }}
                  key={provider}
                >
                  <img
                    src={`${provider === 'Google' ? googleImg : twitchImg}`}
                    alt={provider}
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ZkLoginProvider;

export const useZkLogin = () => {
  const context = React.useContext(ZkLoginContext);
  if (!context) {
    throw new Error('useZkLogin must be used within a ZkLoginProvider');
  }
  return context;
};
