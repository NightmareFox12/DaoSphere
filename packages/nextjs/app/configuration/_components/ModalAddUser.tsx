import { Dispatch, SetStateAction, useState } from 'react';
import { NextPage } from 'next';
import { AddressInput } from '~~/components/scaffold-stark';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useContract, useSendTransaction } from '@starknet-react/core';
import type { Abi } from 'starknet';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';

type ModalAddUserProps = {
  contractAddress: `0x${string}`;
  abi: any;
  adminAddress: string | undefined;
  setShowAddUserModal: Dispatch<SetStateAction<boolean>>;
};

const ModalAddUser: NextPage<ModalAddUserProps> = ({
  contractAddress,
  abi,
  adminAddress,
  setShowAddUserModal,
}) => {
  //states
  const [newUserAddress, setNewUserAddress] = useState<string>('');

  //contract

  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'create_user',
    args: [newUserAddress.toString()],
    address: contractAddress,
  });

  // const abiContract = abi satisfies Abi;
  // const { contract } = useContract({
  //   abi,
  //   address: contractAddress,
  // });

  // const { sendAsync, error } = useSendTransaction({
  //   calls:
  //     contract && adminAddress
  //       ? [contract.populate('create_user', [newUserAddress.toString()])]
  //       : undefined,
  // });

  const handleAddUser = async () => {
    const nose = await sendAsync();
    console.log(nose);
  };

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
            value={newUserAddress}
            onChange={setNewUserAddress}
            placeholder='Input address of the user'
          />

          {!newUserAddress.includes('0x') && newUserAddress.length > 0 && (
            <span className='text-red-500 font-semibold ps-1'>
              Address must start with 0x
            </span>
          )}
        </div>

        <div className='flex justify-center'>
          <button
            className='btn btn-primary px-10'
            onClick={() => handleAddUser()}
            disabled={!newUserAddress.includes('0x')}
          >
            <UserIcon className='w-4 h-4' />
            Create User
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddUser;
