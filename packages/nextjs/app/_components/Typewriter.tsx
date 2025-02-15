import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NextPage } from 'next';

interface TypewriterProps {
  text: string;
  delay: number;
}

const Typewriter: NextPage<TypewriterProps> = ({ text, delay }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <AnimatePresence>
      <motion.div
        className='w-6/12 mx-auto text-center font-semibold mt-10 text-xl'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {currentText}
        <motion.span
          style={{ display: 'inline-block', width: '2px', height: '1em' }}
          className='bg-secondary-content'
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Typewriter;
