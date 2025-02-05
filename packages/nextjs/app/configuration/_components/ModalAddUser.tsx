import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { AddressInput } from '~~/components/scaffold-stark';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ModalAddUser: NextPage = () => {
  const router = useRouter();

  //states
  const [userAddress, setUserAddress] = useState<string>('');
//?AQUI DEBO TRAER EL SHOWOPEN DE LA PAGE PARA PODER CERRAR Y ABRIR, LUEGO EN EL CONTRACT
//? COLOR EL CREAR USUARIO Y MOSTRAR EL EVENTO
  return (
    <motion.dialog
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
      }}
      className='modal'
      open={false}
    >
      <div className='bg-base-300 p-10 rounded-lg border border-primary'>
        <div className='flex w-full justify-between'>
          <h3 className='font-bold text-xl'>Add user</h3>
            <XMarkIcon className='w-6 h-6' onClick={() => console.log('aqui')} />
        </div>
        {/* <p className='py-4 font-semibold text-lg'> */}
        {/* For DAO administrators only. 🤚
        </p> */}

        <AddressInput
          value={userAddress}
          onChange={setUserAddress}
          placeholder='user Address'
        />

        <div className='flex justify-center'>
          <button className='btn px-10' onClick={() => router.back()}>
            <ArrowLeftIcon className='w-4 h-4 font-bold' />
            Back
          </button>
        </div>
      </div>
    </motion.dialog>
  );
};

export default ModalAddUser;
