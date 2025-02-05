'use client';
import { useReadContract } from '@starknet-react/core';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from '~~/hooks/useAccount';

import {
  DAO_ADDRESS_LOCALSTORAGE_KEY,
  DAO_SPHERE_CONTRACT_ABI,
} from '~~/utils/Constants';
import ModalAdmin from './_components/ModalAdmin';
import TableUser from './_components/UserTable';
import { PlusIcon } from '@heroicons/react/20/solid';

const Configuration: NextPage = () => {
  //states
  const [addressParsed, setAddressParsed] = useState<`0x${string}`>('0x0');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>();

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

  useEffect(() => {
    if (isAdmin) return;
  }, [isAdmin]);

  return (
    <>
      {!isAdmin && <ModalAdmin />}

      <section className={`${!isAdmin ? 'blur-md' : ''}`}>
        <article className='flex items-center w-full justify-center m-5 gap-5'>
          <select className='select select-secondary w-full max-w-xs'>
            <option disabled selected>
              quien puede crear votaciones?
            </option>
            <option>All</option>
            <option>Only Admin</option>
          </select>
          <button className='btn'>Select</button>
        </article>

        {isAdmin && (
          <>
            <TableUser addressParsed={addressParsed} />

            <button className='btn btn-circle absolute md:bottom-8 md:right-8 scale-110'>
              <PlusIcon className='w-8 h-8' />
            </button>
          </>
        )}
      </section>
    </>
  );
};

export default Configuration;
