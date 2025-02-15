import { NextPage } from 'next';
import { motion } from 'motion/react';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction, useState } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { Advisor } from '~~/types/Advisor';
import ModalAddAdvisor from './_components/ModalAddAdvisor';
import ModalHandleAdvisor from './_components/ModalHandleAdvisor';
import AdvisorTable from './_components/AdvisorTable';

type AdvisorConfigProps = {
  contractAddress: `0x${string}`;
  setOption: Dispatch<SetStateAction<number | undefined>>;
};

const AdvisorConfig: NextPage<AdvisorConfigProps> = ({
  contractAddress,
  setOption,
}) => {
  //states
  const [showAddAdvisorModal, setShowAddAdvisorModal] =
    useState<boolean>(false);
  const [advisorSelected, setAdvisorSelected] = useState<Advisor | undefined>(
    undefined
  );

  //smart contract
  const { data: advisors } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'get_advisors',
  });

  return (
    <>
      {showAddAdvisorModal && (
        <ModalAddAdvisor
          contractAddress={contractAddress}
          setShowAddAdvisorModal={setShowAddAdvisorModal}
        />
      )}

      {advisorSelected !== undefined && (
        <ModalHandleAdvisor
          contractAddress={contractAddress}
          advisorSelected={advisorSelected}
          setAdvisorSelected={setAdvisorSelected}
        />
      )}

      <div className='relative w-full flex justify-between items-center p-4'>
        <button
          className='btn btn-circle btn-accent hover:scale-110 transition-all delay-75'
          onClick={() => setOption(undefined)}
        >
          <ArrowLeftIcon className='w-8 h-8' />
        </button>

        <motion.div
          whileHover={{ scale: 1.2 }}
          onClick={() => setShowAddAdvisorModal(!showAddAdvisorModal)}
          className='tooltip tooltip-left tooltip-primary'
          data-tip='add advisor'
        >
          <button className='btn btn-circle btn-accent'>
            <PlusIcon className='w-8 h-8' />
          </button>
        </motion.div>
      </div>

      {advisors !== undefined && advisors.length > 0 ? (
        <AdvisorTable
          advisors={advisors as unknown as Advisor[]}
          setAdvisorSelected={setAdvisorSelected}
        />
      ) : (
        <div className='w-full flex items-center justify-center flex-col'>
          <h1 className='text-2xl font-bold text-center'>
            No advisors registered
          </h1>
          <motion.button
            className='btn btn-primary px-10'
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowAddAdvisorModal(!showAddAdvisorModal)}
          >
            Add Advisor
          </motion.button>
        </div>
      )}
    </>
  );
};

export default AdvisorConfig;
