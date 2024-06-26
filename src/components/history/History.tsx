import { useEffect, useMemo, useState } from 'react';
import searchIcon from '@src/assets/svgs/search.svg';
import { HistoryTransactionType } from '@src/lib/types';
import { voiceChatService } from '@src/service/voice-chat.service';

import { useWalletProvider } from '../provider/WalletProvider';

import HistoryItem from './HistoryItem';

const History = () => {
  const { address } = useWalletProvider();
  const [history, setHistory] = useState<HistoryTransactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [viewAll, setViewAll] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      fetchHistory();
    }
  }, [address]);

  const fetchHistory = async () => {
    if (!address) return;

    setLoading(true);
    const res = await voiceChatService.history({ address });
    setHistory(res.data);
    setLoading(false);
  };

  const filteredHistory = useMemo(() => {
    if (!searchValue) return history;

    return history.filter((item) => item.message.toLocaleLowerCase().includes(searchValue));
  }, [history, searchValue]);

  const visibleHistory = viewAll ? filteredHistory : filteredHistory.slice(0, 3);

  return (
    <div className="z-[10] flex max-h-[509px] w-[429px] flex-col gap-6 overflow-hidden rounded-3xl bg-[#1C1C1C] p-4">
      <h1 className="text-left text-[24px] font-medium tracking-[-0.15px] text-[#FFFFFF]">Transaction History</h1>
      <div className="flex items-center gap-2 rounded-[12px] bg-[#444] p-[8px_16px_8px_8px]">
        <img src={searchIcon} alt="search" />
        <input
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          type="text"
          placeholder="Search "
          className="bg-transparent text-[16px] text-white outline-none placeholder:text-[#868686]"
        />
      </div>
      {visibleHistory.length > 0 && !loading ? (
        <div className="flex flex-col gap-2">
          <div className="flex max-h-[220px] flex-col gap-2 overflow-y-auto">
            {visibleHistory.length > 0 ? (
              visibleHistory.map((item, index) => (
                <HistoryItem
                  key={index}
                  amount={item.amount}
                  asset={item.asset}
                  message={item.message}
                  createdAt={item.createdAt}
                />
              ))
            ) : (
              <div className="py-3 text-[16px] text-[#FFFFFF]">No history available</div>
            )}
          </div>
          {!viewAll && filteredHistory.length > 5 && (
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#373737] py-2"
              onClick={() => setViewAll(true)}
            >
              <span className="text-[16px] text-[#FFFFFF]">View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path
                  d="M6 12.5L10 8.5L6 4.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="text-center text-[16px] text-[#FFFFFF]">No history available</div>
        </>
      )}
    </div>
  );
};

export default History;
