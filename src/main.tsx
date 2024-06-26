import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'regenerator-runtime';

import AptosProvider from './components/provider/AptosProvider.tsx';
import SolanaProvider from './components/provider/SolanaProvider.tsx';
import SuiProvider from './components/provider/SuiProvider.tsx';
import VoiceChatProvider from './components/provider/VoiceChatProvider.tsx';
import WalletProvider from './components/provider/WalletProvider.tsx';
import ZkLoginProvider from './components/provider/ZkLoginSuiProvider.tsx';
import App from './App.tsx';

import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SolanaProvider>
        <SuiProvider>
          <AptosProvider>
            <ZkLoginProvider>
              <WalletProvider>
                <VoiceChatProvider>
                  <App />
                  <ToastContainer position="bottom-right" autoClose={2000} />
                </VoiceChatProvider>
              </WalletProvider>
            </ZkLoginProvider>
          </AptosProvider>
        </SuiProvider>
      </SolanaProvider>
    </BrowserRouter>
  </React.StrictMode>
);
