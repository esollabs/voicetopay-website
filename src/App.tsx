import { toast } from 'react-toastify';

import bg from './assets/imgs/bg.png';
import RecordButton from './components/button/RecordButton';
import Header from './components/layouts/header/Header';
import VoiceChatContainer from './components/message/VoiceChatContainer';
import { useVoiceChat } from './components/provider/VoiceChatProvider';
import { useWalletProvider } from './components/provider/WalletProvider';
import { SizeEnum } from './lib/enum';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { listening, isStart, onRecording } = useVoiceChat();
  const { address } = useWalletProvider();

  return (
    <>
      <main
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className={`relative mx-auto h-screen w-screen bg-[url(${bg})] overflow-hidden bg-cover bg-center bg-no-repeat`}
      >
        <Header />
        {!isStart ? (
          <div className="flex h-[calc(100vh-72px)] items-center justify-center">
            <RecordButton
              listening={listening}
              onClick={() => {
                if (!address) {
                  toast.error('Please connect wallet');
                  return;
                }
                onRecording();
              }}
            />
          </div>
        ) : (
          <div className="mx-auto h-[calc(100vh-72px)] max-w-[1440px] px-4 py-[40px] md:px-[120px]">
            <VoiceChatContainer />
          </div>
        )}
        {isStart && (
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 mix-blend-plus-lighter">
            <RecordButton listening={listening} onClick={onRecording} size={SizeEnum.SMALL} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
