'use client';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  COUNT_CREATE_ADVISOR_KEY,
  COUNT_CREATE_USER_KEY,
  DAO_ADDRESS_LOCALSTORAGE_KEY,
  DAO_DEPLOY_BLOCK_LOCALSTORAGE_KEY,
} from '~~/utils/Constants';

const CloseSession: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    localStorage.removeItem(COUNT_CREATE_USER_KEY);
    localStorage.removeItem(COUNT_CREATE_ADVISOR_KEY);
    localStorage.removeItem(DAO_DEPLOY_BLOCK_LOCALSTORAGE_KEY);
    router.push('/');
  }, [, router]);

  return (
    <section className='flex flex-1 w-full h-full justify-center items-center'>
      <h3 className='text-4xl font-bold '>Cerrando Sesión...</h3>
    </section>
  );
};

export default CloseSession;
