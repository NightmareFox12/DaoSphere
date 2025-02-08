import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { AddressInput } from '~~/components/scaffold-stark';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

type ModalAddSupervisorProps = {
  contractAddress: `0x${string}`;
  setShowAddSupervisorModal: Dispatch<SetStateAction<boolean>>;
};

const ModalAddSupervisor: NextPage<ModalAddSupervisorProps> = ({
  contractAddress,
  setShowAddSupervisorModal,
}) => {
  //states
  const [supervisorAddress, setSupervisorAddress] = useState<string>('');
  const [isMatchAddress, setIsMatchAddress] = useState<boolean>(false);

  //smart contract
  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'create_supervisor',
    args: [supervisorAddress],
    address: contractAddress,
  });

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_admin',
    args: [supervisorAddress],
  });

  const { data: isSupervisor } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_supervisor',
    args: [supervisorAddress],
  });

  const handleAddUser = async () => {
    try {
      await sendAsync();
      setSupervisorAddress('');
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (isSupervisor !== undefined) {
      console.log(isSupervisor);
      setIsMatchAddress(Boolean(isSupervisor));
    }
  }, [isSupervisor, supervisorAddress]);

  return (
    <dialog className='modal' open>
      <div className='flex flex-col gap-5 bg-base-300 p-10 rounded-lg border border-primary md:w-7/12 lg:w-8/12'>
        <div className='flex w-full justify-between'>
          <h3 className='font-bold text-xl'>Add user</h3>
          <XMarkIcon
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-all delay-75 ease-in-out'
            onClick={() => setShowAddSupervisorModal(false)}
          />
        </div>

        <div>
          <AddressInput
            value={supervisorAddress}
            onChange={setSupervisorAddress}
            placeholder='Input address of the supervisor'
          />

          {supervisorAddress.length > 0 &&
            (!supervisorAddress.includes('0x') ? (
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
              !supervisorAddress.includes('0x') ||
              supervisorAddress.length === 0 ||
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

export default ModalAddSupervisor;
