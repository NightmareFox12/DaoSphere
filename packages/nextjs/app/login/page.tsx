'use client';

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
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
  const { data: deployBlock } = useScaffoldReadContract({
    contractName: 'DaoSphereFabric',
    functionName: 'get_deploy_block',
  });

  const { data } = useScaffoldEventHistory({
    contractName: 'DaoSphereFabric',
    eventName: 'contracts::DaoSphereFabric::DaoSphereFabric::DaoCreated',
    fromBlock: BigInt(deployBlock?.toString() ?? 0),
    blockData: true,
    transactionData: false,
    receiptData: false,
    watch: true,
    enabled: true,
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
      const dataFilter = data.filter((x) => x.args.name_dao.includes(nameDao));
      setDaoData(dataFilter);
    }
  }, [nameDao, data]);

  return (
    <section className='flex flex-1 flex-col p-10 items-center h-full'>
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

      <article className='flex grow flex-col gap-5 mt-10 lg:mx-10 w-full justify-center overflow-auto max-h-dvh lg:w-10/12'>
        <div className='md:w-6/12 mx-auto'>
          <InputBase
            value={nameDao}
            onChange={(e) => setNameDao(e)}
            placeholder='name DAO'
          />
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <h4 className='text-center font-semibold text-2xl mt-5'>DAO</h4>
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
                <TableDaoPublic
                  daoData={daoData}
                  handleEnterDao={handleEnterDao}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </article>
    </section>
  );
};

export default Login;
