'use client';
import { NextPage } from 'next';
import { useState } from 'react';

type WalletButtonCopyProps = {
  icon: string;
  text: string;
  walletName: string;
};
const WalletButtonCopy: NextPage<WalletButtonCopyProps> = ({
  icon,
  text,
  walletName,
}) => {
  //states
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClick = () => {
    copyToClipboard(walletName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className='flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-full'
    >
      <img src={icon} alt={text} className='h-6 w-6 rounded-full' />
      <span>{text}</span>
      {copied && <span className='text-sm text-success'>copied!</span>}
    </button>
  );
};

export default WalletButtonCopy;
