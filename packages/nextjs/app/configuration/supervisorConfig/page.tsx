import { NextPage } from 'next';
import { motion } from 'motion/react';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction, useState } from 'react';
import { AccountInterface } from 'starknet';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import ModalAddSupervisor from './_components/ModalAddSupervisor';
import ModalHandleSupervisor from './_components/ModalHandleSupervisor';
import { Supervisor } from '~~/types/Supervisor';
import SupervisorTable from './_components/SupervisorTable';

type SupervisorConfigProps = {
  addressParsed: `0x${string}`;
  account: AccountInterface | undefined;
  setOption: Dispatch<SetStateAction<number | undefined>>;
};

const SupervisorConfig: NextPage<SupervisorConfigProps> = ({
  addressParsed,
  account,
  setOption,
}) => {
  const [showAddSupervisorModal, setShowAddSupervisorModal] =
    useState<boolean>(false);
  const [supervisorSelected, setSupervisorSelected] = useState<
    Supervisor | undefined
  >(undefined);

  //smart contract
  const { data: supervisors } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: addressParsed,
    functionName: 'get_supervisors',
  });

  return (
    <>
      {showAddSupervisorModal && (
        <ModalAddSupervisor
          contractAddress={addressParsed}
          setShowAddSupervisorModal={setShowAddSupervisorModal}
        />
      )}

      {supervisorSelected !== undefined && (
        <ModalHandleSupervisor
          contractAddress={addressParsed}
          supervisorSelected={supervisorSelected}
          setSupervisorSelected={setSupervisorSelected}
        />
      )}

      <div className='relative w-full p-4'>
        <button
          className='btn btn-circle btn-accent hover:scale-110 transition-all delay-75'
          onClick={() => setOption(undefined)}
        >
          <ArrowLeftIcon className='w-8 h-8' />
        </button>
      </div>

      {supervisors !== undefined && supervisors.length > 0 ? (
        <SupervisorTable
          supervisors={supervisors as unknown as Supervisor[]}
          setSupervisorSelected={setSupervisorSelected}
        />
      ) : (
        <div className='w-full flex items-center justify-center flex-col'>
          <h1 className='text-2xl font-bold text-center'>
            No supervisors registered
          </h1>
          <motion.button
            className='btn btn-primary px-10'
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowAddSupervisorModal(!showAddSupervisorModal)}
          >
            Add Supervisor
          </motion.button>
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.2 }}
        onClick={() => setShowAddSupervisorModal(!showAddSupervisorModal)}
        className='tooltip tooltip-left tooltip-primary absolute md:bottom-8 md:right-8 scale-110'
        data-tip='add supervisor'
      >
        <button className='btn btn-circle '>
          <PlusIcon className='w-8 h-8' />
        </button>
      </motion.div>
    </>
  );
};

export default SupervisorConfig;
