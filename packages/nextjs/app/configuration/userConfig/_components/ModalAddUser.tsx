import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AddressInput } from '~~/components/scaffold-stark';
import {
  XMarkIcon,
  UserIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

type ModalAddUserProps = {
  contractAddress: `0x${string}`;
  setShowAddUserModal: Dispatch<SetStateAction<boolean>>;
};

const ModalAddUser: NextPage<ModalAddUserProps> = ({
  contractAddress,
  setShowAddUserModal,
}) => {
  //states
  const [userAddress, setUserAddress] = useState<string>('');
  const [isMatchAddress, setIsMatchAddress] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'create_user',
    args: [userAddress],
    contractAddress: contractAddress,
  });

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_admin',
    args: [userAddress],
  });

  const { data: isUser } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_user',
    args: [userAddress],
  });

  const { data: isAdvisor } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_advisor',
    args: [userAddress],
  });

  const handleAddUser = async () => {
    try {
      setIsLoading(true);
      await sendAsync();
      setUserAddress('');
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUser !== undefined && isAdvisor !== undefined) {
      setIsMatchAddress(Boolean(isUser || isAdvisor));
    }
  }, [isAdvisor, isUser, userAddress]);

  return (
    <dialog className='modal' open>
      <div className='flex flex-col gap-5 bg-base-300 p-10 rounded-lg border border-primary md:w-7/12 lg:w-8/12'>
        <div className='flex w-full justify-between'>
          <h3 className='font-bold text-xl'>Add user</h3>
          <XMarkIcon
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-all delay-75 ease-in-out'
            onClick={() => setShowAddUserModal(false)}
          />
        </div>

        <div>
          <AddressInput
            value={userAddress}
            onChange={setUserAddress}
            placeholder='Input address of the user'
          />

          {userAddress.length > 0 &&
            (!userAddress.includes('0x') ? (
              <span className='text-red-500 font-semibold ps-1'>
                Address must start with 0x
              </span>
            ) : isMatchAddress ? (
              <span className='text-red-500 font-semibold ps-1'>
                Address is already registered
              </span>
            ) : (
              isAdmin && (
                <span className='text-red-500 font-semibold ps-1'>
                  Admin cannot be a user
                </span>
              )
            ))}
        </div>

        <div className='flex justify-center'>
          <button
            className='btn btn-primary px-10'
            onClick={() => handleAddUser()}
            disabled={
              isLoading ||
              !userAddress.includes('0x') ||
              userAddress.length === 0 ||
              isMatchAddress ||
              isAdmin?.toString() === 'true'
            }
          >
            {isLoading ? (
              <ArrowPathIcon className='w-4 h-4 animate-spin' />
            ) : (
              <UserIcon className='w-4 h-4' />
            )}
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddUser;
