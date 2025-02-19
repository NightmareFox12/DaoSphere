'use client';

import { NextPage } from 'next';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import { useLoginContext } from '~~/context/LoginContext';
import Image from 'next/image';
import Typewriter from './_components/Typewriter';
import { useAccount } from '~~/hooks/useAccount';
import HomeLogin from './_components/HomeLogin/HomeLogin';

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();

  //context
  const { isLogin, setIsLogin } = useLoginContext();

  //states
  const [daoAddress, setDaoAddress] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    const daoAddress = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    setIsLogin(daoAddress !== null && daoAddress !== undefined);

    if (daoAddress) {
      setDaoAddress(daoAddress as `0x${string}`);
    }
  }, [isLogin, setIsLogin]);

  return (
    <main>
      {!isLogin ? (
        <>
          <motion.div
            className='mt-24 flex items-center flex-col'
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
              repeat: Infinity,
            }}
          >
            <Image
              alt='DS logo'
              className='object-fill w-4/2 h-4/2'
              width={300}
              height={300}
              priority={true}
              src='/logo.png'
            />
          </motion.div>

          {isConnected && (
            <Typewriter
              text='Descentralized Application designed to create and manage proposals for resolve problems in a democratic way.'
              delay={50}
            />
          )}

          <section className='flex w-8/12 mx-auto justify-center items-center my-10 gap-10 select-none'>
            <article className='card w-96 shadow-xl border border-gradient transition-transform delay-75 hover:scale-105'>
              <div
                className='card-body cursor-pointer  '
                onClick={() => router.push('/register')}
              >
                <h2 className='card-title text-center'>Register</h2>
                <p>Create new DAO</p>
              </div>
            </article>

            <article className='card w-96 shadow-xl border border-gradient transition-transform delay-75 hover:scale-105'>
              <div
                className='card-body cursor-pointer  '
                onClick={() => router.push('/login')}
              >
                <h2 className='card-title'>Login</h2>
                <p>enter a DAO</p>
              </div>
            </article>
          </section>
        </>
      ) : (
        <HomeLogin address={address} daoAddress={daoAddress} />
      )}
    </main>
  );
};

export default Home;
