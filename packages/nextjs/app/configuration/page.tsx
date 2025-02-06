'use client';
import { useReadContract } from '@starknet-react/core';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from '~~/hooks/useAccount';
import { motion } from 'motion/react';
import {
  DAO_ADDRESS_LOCALSTORAGE_KEY,
  DAO_SPHERE_CONTRACT_ABI,
} from '~~/utils/Constants';
import ModalAdmin from './_components/ModalAdmin';
import TableUser from './_components/UserTable';
import { PlusIcon } from '@heroicons/react/20/solid';
import ModalAddUser from './_components/ModalAddUser';

const Configuration: NextPage = () => {
  //states
  const [addressParsed, setAddressParsed] = useState<`0x${string}`>('0x0');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [option, setOption] = useState(0);

  //smart contract
  const { account } = useAccount();

  const { data: isAdmin, error } = useReadContract({
    address: addressParsed,
    abi: DAO_SPHERE_CONTRACT_ABI,
    functionName: 'is_admin',
    args: [`${account?.address}`],
  });

  useEffect(() => {
    const address = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (address !== null) {
      const addressParsed: `0x${string}` = `0x${address.slice(2)}`;
      setAddressParsed(addressParsed);
    }
  }, []);

  return (
    <>
      {!isAdmin && <ModalAdmin />}

      <section className={`${!isAdmin ? 'blur-md' : ''}`}>
        {showAddUserModal && (
          <ModalAddUser
          contractAddress={addressParsed}
          abi={DAO_SPHERE_CONTRACT_ABI}
          userAddress={account?.address}
            setShowAddUserModal={setShowAddUserModal}
          />
        )}
        <article className='flex items-center w-full justify-center m-5 gap-5'>
          {/* <select
            className='select select-secondary w-full max-w-xs'
            name='fritos'
          >
            <option disabled selected value={'all si'}>
              quien puede crear votaciones?
            </option>
            <option value='All'>All</option>
            <option value='admin'>Only Admin</option>
          </select> */}
          <button
            className='btn'
            onClick={() => {
              // console.log(quien);
            }}
          >
            Select
          </button>
        </article>

        {isAdmin && (
          <>
            <TableUser addressParsed={addressParsed} />

            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => setShowAddUserModal(!showAddUserModal)}
              className='tooltip tooltip-left tooltip-primary absolute md:bottom-8 md:right-8 scale-110'
              data-tip='add user'
            >
              <button className='btn btn-circle '>
                <PlusIcon className='w-8 h-8' />
              </button>
            </motion.div>
          </>
        )}
      </section>
    </>
  );
};

export default Configuration;
