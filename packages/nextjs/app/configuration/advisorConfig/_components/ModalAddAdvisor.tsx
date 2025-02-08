import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AddressInput } from '~~/components/scaffold-stark';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

type ModalAddAdvisorProps = {
  contractAddress: `0x${string}`;
  setShowAddAdvisorModal: Dispatch<SetStateAction<boolean>>;
};

const ModalAddAdvisor: NextPage<ModalAddAdvisorProps> = ({
  contractAddress,
  setShowAddAdvisorModal,
}) => {
  //states
  const [advisorAddress, setAdvisorAddress] = useState<string>('');
  const [isMatchAddress, setIsMatchAddress] = useState<boolean>(false);

  //smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'create_advisor',
    args: [advisorAddress],
    address: contractAddress,
  });

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_admin',
    args: [advisorAddress],
  });

  const { data: isAdvisor } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_advisor',
    args: [advisorAddress],
  });

  const { data: isUser } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_user',
    args: [advisorAddress],
  });

  const handleAddUser = async () => {
    try {
      await sendAsync();
      setAdvisorAddress('');
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (isAdvisor !== undefined && isUser !== undefined) {
      setIsMatchAddress(Boolean(isAdvisor || isUser));
    }
  }, [isAdvisor, isUser, advisorAddress]);

  return (
    <dialog className='modal' open>
      <div className='flex flex-col gap-5 bg-base-300 p-10 rounded-lg border border-primary md:w-7/12 lg:w-8/12'>
        <div className='flex w-full justify-between'>
          <h3 className='font-bold text-xl'>Add user</h3>
          <XMarkIcon
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-all delay-75 ease-in-out'
            onClick={() => setShowAddAdvisorModal(false)}
          />
        </div>

        <div>
          <AddressInput
            value={advisorAddress}
            onChange={setAdvisorAddress}
            placeholder='Input address of the advisor'
          />

          {advisorAddress.length > 0 &&
            (!advisorAddress.includes('0x') ? (
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
                  Admin cannot be a supervisor
                </span>
              )
            ))}
        </div>

        <div className='flex justify-center'>
          <button
            className='btn btn-primary px-10'
            onClick={() => handleAddUser()}
            disabled={
              !advisorAddress.includes('0x') ||
              advisorAddress.length === 0 ||
              isAdmin?.toString() === 'true'
            }
          >
            <UserIcon className='w-4 h-4' />
            Create Supervisor
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddAdvisor;
