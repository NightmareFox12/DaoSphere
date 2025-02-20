'use client';

import { AnimatePresence, motion } from 'motion/react';
import { NextPage } from 'next';
import { useTheme } from 'next-themes';
import Image from 'next/image';
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
  const { theme } = useTheme();

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
      className={`${theme === 'light' ? 'btn-primary' : 'btn-base-100'} btn w-2/6 hover:scale-110 outline outline-2 outline-secondary`}
    >
      <Image
        src={icon}
        alt={text}
        width={30}
        height={30}
        className='h-6 w-6 rounded-full'
      />
      <span>{text}</span>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-sm text-info font-bold'
          >
            copied!
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default WalletButtonCopy;
