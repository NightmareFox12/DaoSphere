'use client';

import { NextPage } from 'next';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import { useLoginContext } from '~~/context/LoginContext';

const Home: NextPage = () => {
  const router = useRouter();

  //context
  const { isLogin, setIsLogin } = useLoginContext();

  //states
  const [daoAddress2, setDaoAddress2] = useState<string | null>(null);

  useEffect(() => {
    const daoAddress = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    setIsLogin(daoAddress !== null && daoAddress !== undefined);
    setDaoAddress2(daoAddress);
  }, [, isLogin]);

  return (
    <main>
      <h1 className='font-bold '>{daoAddress2?.toString()}</h1>

      {!isLogin && (
        <>
          <motion.div
            className='mt-24 flex items-center flex-col'
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
            }}
          >
            <h1 className='text-center font-bold text-6xl'>DaoSphere</h1>
          </motion.div>

          <div className='w-6/12 mx-auto text-center font-semibold mt-10'>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Distinctio at doloremque qui eos doloribus sapiente, sint expedita
              maxime porro magnam nam explicabo? Ut reiciendis sed quis nihil
              ipsa, commodi iste.
            </p>
          </div>

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
      )}
    </main>
  );
};

export default Home;
