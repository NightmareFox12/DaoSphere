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
    args: [''],
    contractAddress: contractAddress,
  });

  useEffect(() => {
    if (voteCreationData === undefined) return;
    const voteCreationAccessParsed =
      voteCreationData as unknown as VoteCreationAccess;
    setVoteCreationAccess(voteCreationAccessParsed);
  }, [voteCreationData]);

  //functions
  const handleVoteCreationAccess = async (value: string) => {
    try {
      await sendAsync({ args: [value] });
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
              <option selected={voteCreationAccess.variant.Admin} value='Admin'>
                Admin
              </option>
              <option
                selected={voteCreationAccess.variant.AdminOrAdvisor}
                value='AdminOrAdvisor'
              >
                Admin and Advisors
              </option>
              <option selected={voteCreationAccess.variant.All} value='All'>
                All
              </option>
            </select>
          </div>
        )}
      </AnimatePresence>

      <article className='w-full h-full flex gap-5 bg-dark-900 p-4 rounded-lg'>
        {users !== undefined &&
        advisors !== undefined &&
        (users.length > 0 || advisors.length > 0) ? (
          <section className='w-9/12 flex items-center justify-between mx-auto mt-16'>
            <article>
              <h3 className='text-center text-lg font-bold'>
                Users and Advisors
              </h3>

              <StyledEngineProvider injectFirst>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: users.length,
                          color: '#34EEB6',
                          label: 'users',
                        },
                        {
                          id: 1,
                          value: advisors.length,
                          color: '#5368B4',
                          label: 'advisors',
                        },
                      ],
                    },
                  ]}
                  slotProps={{ legend: { hidden: true } }}
                  height={250}
                  width={250}
                />
              </StyledEngineProvider>
            </article>

            {users.filter((x: any) => !x.unlock).length > 0 &&
            advisors.filter((x: any) => !x.unlock).length > 0 ? (
              <article>
                <h3 className='text-center text-lg font-bold'>
                  Users and Advisors Blocked
                </h3>
                <StyledEngineProvider injectFirst>
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            value: users.filter((x: any) => !x.unlock).length,
                            color: '#34EEB6',
                            label: 'users',
                          },
                          {
                            value: advisors.filter((x: any) => !x.unlock)
                              .length,
                            color: '#5368B4',
                            label: 'advisors',
                          },
                        ],
                      },
                    ]}
                    slotProps={{ legend: { hidden: true } }}
                    height={250}
                    width={250}
                  />
                </StyledEngineProvider>
              </article>
            ) : (
              <p className='text-center text-lg font-bold'>
                No users or advisors blocked
              </p>
            )}
          </section>
        ) : (
          <div className='w-full h-full mt-36 flex justify-center items-center'>
            <p className='text-center text-2xl font-bold'>
              No users or advisors
            </p>
          </div>
        )}
      </article>
    </>
  );
};

export default DataConfig;
