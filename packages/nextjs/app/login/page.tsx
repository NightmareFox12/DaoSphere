'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import {
  DAO_ADDRESS_LOCALSTORAGE_KEY,
  DAO_SPHERE_CONTRACT_ABI,
} from '~~/utils/Constants';
import { InputBase } from '~~/components/scaffold-stark';
import { SwitchTheme } from '~~/components/SwitchTheme';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useReadContract } from '@starknet-react/core';

import { getChecksumAddress } from 'starknet';
import { feltToHex } from '~~/utils/scaffold-stark/common';

const Login: NextPage = () => {
  const router = useRouter();

  //states
  const [nameDao, setNameDao] = useState<string>('');
  const [addressDao, setAddressDao] = useState<string>('');
  const [addressDaoParsed, setAddressDaoParsed] = useState<`0x${string}`>('0x');
  const [daoData, setDaoData] = useState<any[]>([]);

  //smart contract
  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName: 'DaoSphereFabric',
    eventName: 'contracts::DaoSphereFabric::DaoSphereFabric::DaoCreated',
    fromBlock: BigInt(0),
    blockData: true,
    transactionData: false,
    receiptData: false,
    watch: true,
    enabled: true,
  });

  const { data: nose } = useReadContract({
    functionName: 'address_exist',
    address: addressDaoParsed,
    abi: DAO_SPHERE_CONTRACT_ABI,
  });

  //functions
  const handleEnterDao = (daoAddress: bigint) => {
    const addressParsed = getChecksumAddress(feltToHex(daoAddress));
    localStorage.setItem(
      DAO_ADDRESS_LOCALSTORAGE_KEY,
      addressParsed.toString()
    );
    router.push('/');
  };

  useEffect(() => {
    const daoAddress = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (daoAddress !== null) router.push('/');
  });

  useEffect(() => {
    if (data !== undefined) {
      const dataFilter = data.filter((x) => x.args.name_dao.includes(nameDao));
      setDaoData(dataFilter);
    }
  }, [nameDao, data]);

  useEffect(() => {
    let parsed: `0x${string}` = `0x${addressDao.slice(2)}`;
    setAddressDaoParsed(parsed);
  }, [addressDao, nose]);

  return (
    <section className='flex flex-1 flex-col p-10 items-center h-full'>
      <div className='absolute flex top-0 justify-between w-full items-center mt-2 px-5'>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={() => router.push('/')}
          className='btn btn-circle'
        >
          <ArrowLeftIcon className='w-6 h-6' />
        </motion.button>

        <SwitchTheme />
      </div>

      <article className='flex grow flex-col gap-5 mt-10 lg:mx-10 w-full justify-center overflow-auto max-h-dvh lg:w-10/12'>
        <div className='md:w-6/12 mx-auto'>
          <InputBase
            value={nameDao}
            onChange={(e) => setNameDao(e)}
            placeholder='name DAO public'
          />
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <h4 className='text-center font-semibold text-2xl mt-5'>
              DAO's public
            </h4>
            <AnimatePresence>
              {daoData.length === 0 && data.length !== 0 ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className='text-center text-lg'
                >
                  There is no DAO by that name
                </motion.p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className='overflow-x-auto w-full'
                >
                  <table className='table w-full'>
                    <thead>
                      <tr>
                        <th></th>
                        <th className='text-center'>Name</th>
                        <th className='text-center'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daoData.slice(0, 20).map((x, y) => (
                        <tr>
                          <th>{y + 1}</th>
                          <td className='text-center'>{x.args.name_dao}</td>
                          <td className='text-center'>
                            <button
                              className='btn btn-base px-10'
                              onClick={() => handleEnterDao(x.args.dao_address)}
                            >
                              Enter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </article>
    </section>
  );
};

export default Login;
