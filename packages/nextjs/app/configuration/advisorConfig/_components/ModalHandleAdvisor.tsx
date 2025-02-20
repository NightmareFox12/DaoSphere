'use client'

import { Dispatch, SetStateAction } from 'react';
import { NextPage } from 'next';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { Advisor } from '~~/types/Advisor';
import {
  ArrowLeftIcon,
  LockOpenIcon,
  NoSymbolIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

type ModalHandleAdvisorProps = {
  contractAddress: `0x${string}`;
  advisorSelected: Advisor;
  setAdvisorSelected: Dispatch<SetStateAction<Advisor | undefined>>;
};

const ModalHandleAdvisor: NextPage<ModalHandleAdvisorProps> = ({
  contractAddress,
  setAdvisorSelected,
  advisorSelected,
}) => {
  //smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'modify_advisor',
    args: [advisorSelected.advisor_id],
    contractAddress: contractAddress,
  });

  const handleAddUser = async () => {
    try {
      await sendAsync();
      setAdvisorSelected(undefined);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <dialog className='modal' open>
      <div className='flex flex-col gap-5 bg-base-300 p-10 rounded-lg border border-primary md:w-3/6'>
        <div className='flex w-full justify-between'>
          <h3 className='font-bold text-xl'>Confirmation</h3>
          <XMarkIcon
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-all delay-75 ease-in-out'
            onClick={() => setAdvisorSelected(undefined)}
          />
        </div>
        <p className='text-center text-lg break-words font-semibold'>
          Are you sure you want to {advisorSelected.unlock ? 'block' : 'unlock'}{' '}
          the advisor?
        </p>

        <div className='flex justify-center gap-5'>
          <button
            className='btn btn-outline btn-base-300 px-10'
            onClick={() => setAdvisorSelected(undefined)}
          >
            <ArrowLeftIcon className='size-5' />
            Cancel
          </button>

          <button
            className={`${advisorSelected.unlock ? 'btn-error' : 'btn-success'} btn btn-outline px-10   hover:scale-110 transition-all delay-75`}
            onClick={() => handleAddUser()}
          >
            {advisorSelected.unlock ? (
              <NoSymbolIcon className='size-4 stroke-red-500 stroke-10' />
            ) : (
              <LockOpenIcon className='size-4 stroke-green-500 stroke-10' />
            )}
            {advisorSelected.unlock ? 'Block' : 'Unlock'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalHandleAdvisor;