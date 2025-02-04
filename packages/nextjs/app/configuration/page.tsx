'use client';
import { useReadContract } from '@starknet-react/core';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from '~~/hooks/useAccount';

import {
  DAO_ADDRESS_LOCALSTORAGE_KEY,
  DAO_SPHERE_CONTRACT_ABI,
} from '~~/utils/Constants';

const Configuration: NextPage = () => {
  //states
  const [addressParsed, setAddressParsed] = useState<`0x${string}`>('0x0');

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
      <h1>{isAdmin?.toString()}</h1>
    </>
  );
};

export default Configuration;
