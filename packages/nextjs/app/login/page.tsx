'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import {
  DAO_ADDRESS_LOCALSTORAGE_KEY,
  DAO_DEPLOY_BLOCK_LOCALSTORAGE_KEY,
} from '~~/utils/Constants';
import { InputBase } from '~~/components/scaffold-stark';
import { SwitchTheme } from '~~/components/SwitchTheme';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getChecksumAddress } from 'starknet';
import { feltToHex } from '~~/utils/scaffold-stark/common';
import { CustomConnectButton } from '~~/components/scaffold-stark/CustomConnectButton';
import TableDaoPublic from './_components/TableDao';
import { useRouter } from 'next/navigation';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

const Login: NextPage = () => {
  const router = useRouter();

  //states
  const [nameDao, setNameDao] = useState<string>('');
  const [daoData, setDaoData] = useState<any[]>([]);

  //smart contract
  const { data, isLoading } = useScaffoldReadContract({
    contractName: 'DaoSphereFabric',
    functionName: 'get_daos',
  });

  //functions
  const handleEnterDao = (daoAddress: bigint, deployBlock: bigint) => {
    const addressParsed = getChecksumAddress(feltToHex(daoAddress));
    localStorage.setItem(
      DAO_ADDRESS_LOCALSTORAGE_KEY,
      addressParsed.toString()
    );
    localStorage.setItem(
      DAO_DEPLOY_BLOCK_LOCALSTORAGE_KEY,
      deployBlock.toString()
    );
    router.push('/');
  };

  useEffect(() => {
    const daoAddress = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (daoAddress !== null) router.push('/');
  });

  useEffect(() => {
    if (data !== undefined) {
      const dataFilter = data.filter((x: any) => x.name_dao.includes(nameDao));
      setDaoData(dataFilter);
    }
  }, [nameDao, data]);

  return (
    <section className='flex flex-col w-full justify-center !overflow-hidden'>
      <div className='absolute flex top-0 justify-between w-full items-center mt-2 px-5'>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={() => router.push('/')}
          className='btn btn-circle btn-accent'
        >
          <ArrowLeftIcon className='w-6 h-6' />
        </motion.button>

        <div className='flex justify-center items-center gap-2'>
          <CustomConnectButton />
          <SwitchTheme />
        </div>
      </div>

      <article className='w-full mt-48'>
        <div className='flex flex-4 flex-col w-9/12 mx-auto md:w-6/12 '>
          <InputBase
            value={nameDao}
            onChange={(e) => setNameDao(e)}
            placeholder='name DAO'
          />
        </div>

        <h4 className='text-center font-semibold text-2xl mt-5'>DAO</h4>

        {isLoading ? (
          <div className='flex items-center justify-center w-full mt-10'>
            <span className='loading loading-dots loading-lg' />
          </div>
        ) : (
          <div className='md:w-10/12 mx-auto overflow-auto'>
            <AnimatePresence>
              <motion.article
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className='flex-1'
              >
                {daoData.length === 0 && data && data.length > 0 ? (
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
                    className='h-96'
                  >
                    <TableDaoPublic
                      daoData={daoData}
                      handleEnterDao={handleEnterDao}
                    />
                  </motion.div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        )}
      </article>
    </section>
  );
};

export default Login;
