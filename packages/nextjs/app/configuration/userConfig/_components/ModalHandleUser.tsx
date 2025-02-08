import { Dispatch, SetStateAction } from 'react';
import { NextPage } from 'next';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import {
  ArrowLeftIcon,
  LockOpenIcon,
  NoSymbolIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { User } from '~~/types/User';

type ModalHandleUserProps = {
  contractAddress: `0x${string}`;
  userSelected: User;
  setUserSelected: Dispatch<SetStateAction<User | undefined>>;
};

const ModalHandleUser: NextPage<ModalHandleUserProps> = ({
  contractAddress,
  setUserSelected,
  userSelected,
}) => {
  //smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'modify_user',
    args: [userSelected.user_id],
    address: contractAddress,
  });

  const handleAddUser = async () => {
    try {
      await sendAsync();
      setUserSelected(undefined);
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
            onClick={() => setUserSelected(undefined)}
          />
        </div>
        <p className='text-center text-lg break-words font-semibold'>
          Are you sure you want to {userSelected.unlock ? 'block' : 'unlock'} the user?
        </p>

        <div className='flex justify-center gap-5'>
          <button
            className='btn btn-outline btn-base-300 px-10'
            onClick={() => setUserSelected(undefined)}
          >
            <ArrowLeftIcon className='size-5' />
            Cancel
          </button>

          <button
            className={`${userSelected.unlock ? 'btn-error' : 'btn-success'} btn btn-outline px-10   hover:scale-110 transition-all delay-75`}
            onClick={() => handleAddUser()}
          >
            {userSelected.unlock ? (
              <NoSymbolIcon className='size-4 stroke-red-500 stroke-10' />
            ) : (
              <LockOpenIcon className='size-4 stroke-green-500 stroke-10' />
            )}
            {userSelected.unlock ? 'Block' : 'Unlock'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalHandleUser;
