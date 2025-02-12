'use client';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { PieChart } from '@mui/x-charts';
import { NextPage } from 'next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { StyledEngineProvider } from '@mui/material/styles';
import VoteCreationAccess from '~~/types/VoteCreationAccess';
import { AnimatePresence } from 'motion/react';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';

type DataConfigProps = {
  contractAddress: `0x${string}`;
  setOption: Dispatch<SetStateAction<number | undefined>>;
};

const DataConfig: NextPage<DataConfigProps> = ({
  contractAddress,
  setOption,
}) => {
  //states
  const [voteCreationAccess, setVoteCreationAccess] = useState<
    VoteCreationAccess | undefined
  >(undefined);

  //smart contract
  const { data: users } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_users',
    contractAddress: contractAddress,
  });

  const { data: advisors } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_advisors',
    contractAddress: contractAddress,
  });

  const { data: voteCreationData } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_vote_creation_access',
    contractAddress: contractAddress,
  });

  const { sendAsync } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'modify_vote_creation_access',
  });

  useEffect(() => {
    console.log(voteCreationData);
    if (voteCreationData === undefined) return;
    const voteCreationAccessParsed =
      voteCreationData as unknown as VoteCreationAccess;
    setVoteCreationAccess(voteCreationAccessParsed);
  }, [voteCreationData]);

  const handleVoteCreationAccess = async (value: string) => {
    try {
      await sendAsync();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='relative w-full p-4'>
        <button
          className='btn btn-circle btn-accent hover:scale-110 transition-all delay-75'
          onClick={() => setOption(undefined)}
        >
          <ArrowLeftIcon className='w-8 h-8' />
        </button>
      </div>

      <AnimatePresence>
        {voteCreationAccess !== undefined && (
          <div className='flex justify-center items-center gap-5'>
            <p className='font-semibold text-base'>Who can create votes?</p>
            <select
              className='select select-bordered w-full max-w-xs font-bold'
              onChange={(e) => {
                handleVoteCreationAccess(e.target.value);
              }}
            >
              <option disabled>Select who can create votes</option>
              <option selected={voteCreationAccess.variant.Admin}>Admin</option>
              <option selected={voteCreationAccess.variant.AdminOrAdvisor}>
                Admin and Advisors
              </option>
              <option selected={voteCreationAccess.variant.All}>All</option>
            </select>
          </div>
        )}
      </AnimatePresence>

      <article className='w-full h-full flex gap-5 bg-dark-900 p-4 rounded-lg'>
        {/* {users !== undefined && advisors !== undefined && (users.length > 0 || advisors.length > 0) && (
          <StyledEngineProvider injectFirst>
            <PieChart
              series={[
                {
                  data: [
                    { value: users.length, color: 'orange', label: 'users' },
                    {
                      value: advisors.length,
                      color: 'green',
                      label: 'advisors',
                    },
                  ],
                },
              ]}
              width={250}
              height={250}
            />

            <PieChart
              series={[
                {
                  data: [
                    { value: users.length, color: 'orange', label: 'users' },
                    {
                      value: advisors.length,
                      color: 'green',
                      label: 'advisors',
                    },
                  ],
                },
              ]}
              width={250}
              height={250}
            />
          </StyledEngineProvider>
        )} */}
      </article>
    </>
  );
};

export default DataConfig;
