import React from 'react';

const TextHighlighter = ({ text }: { text: string }) => {
  const numberRegex = /\b\d+\b/g;
  const solRegex = /\.sol\b/g;
  const suiRegex = /\.sui\b/g;
  const tokenNameArray = ['usdc', 'usdt', 'sol', 'btc', 'eth', 'sui', 'apt'];

  const parts = text?.split(' ');

  const highlightText = (part: string) => {
    if (numberRegex.test(part) || tokenNameArray.includes(part.toLowerCase())) {
      return <span className="uppercase text-[#19FB9B]">{part}</span>;
    } else if (solRegex.test(part) || suiRegex.test(part)) {
      return <span className="capitalize text-[#9945FF]">{part}</span>;
    } else {
      return <span className="text-white">{part}</span>;
    }
  };

  // Mapping over parts to apply highlighting
  const highlightedText = parts
    ? parts?.map((part, index) => <React.Fragment key={index}>{highlightText(part)} </React.Fragment>)
    : '';

  return <div className="max-w-[620px] text-right text-sm font-medium md:text-2xl">{highlightedText}</div>;
};

export default TextHighlighter;
