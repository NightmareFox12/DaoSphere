'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import { InputBase } from '~~/components/scaffold-stark';
import { SwitchTheme } from '~~/components/SwitchTheme';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CustomConnectButton } from '~~/components/scaffold-stark/CustomConnectButton';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { Dao } from '~~/types/Dao';

const Register: NextPage = () => {
  const router = useRouter();

  //states
  const [nameDao, setNameDao] = useState<string>('');
  const [enableButton, setEnableButton] = useState<boolean>(false);

  const [loaderCreateDao, setLoaderCreateDao] = useState<boolean>(false);

  //smart contract
  const { data: daos } = useScaffoldReadContract({
    contractName: 'DaoSphereFabric',
    functionName: 'get_daos',
  });

  useEffect(() => {
    const daoAddress = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (daoAddress !== null) router.push('/');
  });

  useEffect(() => {
    if (daos !== undefined) {
      const daoParsed = daos as unknown as Dao[];

      const isMatch = daoParsed.some(
        (x) => x.name_dao.toLowerCase() === nameDao.toLowerCase()
      );
      setEnableButton(!isMatch);
    }
  }, [nameDao, daos]);

  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphereFabric',
    functionName: 'create_dao',
    args: [nameDao],
  });

  const handleCreateDao = async () => {
    try {
      setLoaderCreateDao(true);
      await sendAsync({ args: [nameDao] });

      router.push('/login');
      setNameDao('');
    } catch (err) {
      console.log(err);
    } finally {
      setLoaderCreateDao(false);
    }
  };

  return (
    <section className='flex flex-1 flex-col p-10 items-center h-full justify-center'>
      <h1 className='text-4xl text-center font-semibold mb-5'>DaoSphere</h1>
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

      <article className='flex flex-col gap-5 mx-10 w-7/12 lg:w-5/12'>
        <div>
          <label className='ps-2 font-bold'>
            Name Dao <span className='font-bold text-error'>*</span>
          </label>
          <InputBase
            value={nameDao}
            onChange={(e) => {
              if (e.length < 50) setNameDao(e);
            }}
            placeholder='Name Dao'
            disabled={loaderCreateDao}
          />
          <AnimatePresence>
            {nameDao.length < 3 && nameDao != '' ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className='text-error font-semibold ps-1'
              >
                Name Dao is too short
              </motion.span>
            ) : (
              !enableButton && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className='text-error font-semibold ps-1'
                >
                  {nameDao} already exists
                </motion.span>
              )
            )}
          </AnimatePresence>
        </div>

        <button
          className='btn btn-primary mx-10'
          disabled={nameDao.length < 3 || !enableButton || loaderCreateDao}
          onClick={() => handleCreateDao()}
        >
          {loaderCreateDao && (
            <span className=' animate-spin'>
              <ArrowPathIcon className='w-6 h-6' />
            </span>
          )}
          Create Dao
        </button>
      </article>
    </section>
  );
};

export default Register;
