import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const ModalAdminOrSupervisor: NextPage = () => {
  const router = useRouter();

  return (
    <motion.dialog
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
      }}
      className='modal'
      open
    >
      <div className='bg-base-300 p-10 rounded-lg border border-primary'>
        <h3 className='font-bold text-2xl'>Restricted Access 🚫</h3>
        <p className='py-4 font-semibold text-lg'>
          For DAO administrators or supervisors only. 🤚
        </p>

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

export default ModalAdminOrSupervisor;
