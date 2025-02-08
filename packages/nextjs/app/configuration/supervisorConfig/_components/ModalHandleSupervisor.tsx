import { Dispatch, SetStateAction } from 'react';
import { NextPage } from 'next';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { Supervisor } from '~~/types/Supervisor';
import {
  ArrowLeftIcon,
  LockOpenIcon,
  NoSymbolIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

type ModalHandleSupervisorProps = {
  contractAddress: `0x${string}`;
  supervisorSelected: Supervisor;
  setSupervisorSelected: Dispatch<SetStateAction<Supervisor | undefined>>;
};

const ModalHandleSupervisor: NextPage<ModalHandleSupervisorProps> = ({
  contractAddress,
  setSupervisorSelected,
  supervisorSelected,
}) => {
  //smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'modify_supervisor',
    args: [supervisorSelected.supervisor_id],
    address: contractAddress,
  });

  const handleAddUser = async () => {
    try {
      await sendAsync();
      setSupervisorSelected(undefined);
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
            onClick={() => setSupervisorSelected(undefined)}
          />
        </div>
        <p className='text-center text-lg break-words font-semibold'>
          Are you sure you want to{' '}
          {supervisorSelected.unlock ? 'block' : 'unlock'} the supervisor?
        </p>

        <div className='flex justify-center gap-5'>
          <button
            className='btn btn-outline btn-base-300 px-10'
            onClick={() => setSupervisorSelected(undefined)}
          >
            <ArrowLeftIcon className='size-5' />
            Cancel
          </button>

          <button
            className={`${supervisorSelected.unlock ? 'btn-error' : 'btn-success'} btn btn-outline px-10   hover:scale-110 transition-all delay-75`}
            onClick={() => handleAddUser()}
          >
            {supervisorSelected.unlock ? (
              <NoSymbolIcon className='size-4 stroke-red-500 stroke-10' />
            ) : (
              <LockOpenIcon className='size-4 stroke-green-500 stroke-10' />
            )}
            {supervisorSelected.unlock ? 'Block' : 'Unlock'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalHandleSupervisor;
