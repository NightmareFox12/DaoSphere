'use client';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';

const CloseSession: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    router.push('/');
  }, []);

  return (
    <section className='flex flex-1 w-full h-full justify-center items-center'>
      <h3 className='text-4xl font-bold '>Cerrando Sesión...</h3>
    </section>
  );
};

export default CloseSession;
