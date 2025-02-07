import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import { motion, AnimatePresence } from 'motion/react';

const Toast: NextPage = () => {
  //states
  const [showToast, setShowToast] = useState<boolean>(false);
  const [addressParsed, setAddressParsed] = useState<`0x${string}`>('0x0');

  //smart contract
  const { data: userEvent } = useScaffoldEventHistory({
    contractName: 'DaoSphere',
    eventName: 'contracts::DaoSphere::DaoSphere::CreatedUser',
    fromBlock: 0n,
    watch: true,
    contractAddress: addressParsed,
  });

  useEffect(() => {
    const address = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (address !== null) {
      const addressParsed: `0x${string}` = `0x${address.slice(2)}`;
      setAddressParsed(addressParsed);
    }
  }, []);

  useEffect(() => {
    const countUser = localStorage.getItem('count');

    if (userEvent !== undefined) {
      if (userEvent.length > parseInt(countUser?.toString() ?? '0')) {
        setShowToast(true);
        localStorage.setItem('count', userEvent.length.toString());
      }
    }

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }, [userEvent]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          className='toast'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='alert alert-info'>
            <span>New user created</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
