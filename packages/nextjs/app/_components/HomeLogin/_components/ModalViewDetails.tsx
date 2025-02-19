import { XMarkIcon } from '@heroicons/react/24/outline';
import { StyledEngineProvider } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { motion } from 'motion/react';
import { NextPage } from 'next';
import { useTheme } from 'next-themes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import { Proposal } from '~~/types/Proposal';
import { VotedProposal } from '~~/types/VotedProposal';
import { feltToHex } from '~~/utils/scaffold-stark/common';

type ModalViewDetailsProps = {
  proposal: Proposal;
  setProposalSelected: Dispatch<SetStateAction<Proposal | undefined>>;
  contractAddress: `0x${string}`;
};

const ModalViewDetails: NextPage<ModalViewDetailsProps> = ({
  proposal,
  setProposalSelected,
  contractAddress,
}) => {
  const { theme } = useTheme();
  //states
  const [optionSelected, setOptionSelected] = useState<number>(0);
  const [yesVotes, setYesVotes] = useState<number>(0);
  const [noVotes, setNoVotes] = useState<number>(0);

  //smart contract
  const { data: votesProposal, isLoading } = useScaffoldEventHistory({
    contractName: 'DaoSphere',
    eventName: 'contracts::DaoSphere::DaoSphere::VotedProposal',
    filters: {
      proposal_id: proposal.proposal_id,
    },
    contractAddress,
    fromBlock: 0n,
  });

  
  useEffect(() => {
    const yesVotes = votesProposal?.filter((x: any) => x.args.vote_choice === true);
    const noVotes = votesProposal?.filter(
      (x: any) => x.args.vote_choice === false
    );

    setYesVotes(yesVotes?.length ?? 0);
    setNoVotes(noVotes?.length ?? 0);
  }, [votesProposal]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full p-10 bg-black/50'
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className='flex flex-col bg-base-100 w-full sm:w-8/12 h-full rounded-3xl m-10 p-5 outline outline-2 outline-accent'
      >
        <article className='flex flex-col flex-2'>
          <div className='p-1 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>Proposal Details</h2>
            <button
              className='btn btn-circle btn-outline'
              onClick={() => setProposalSelected(undefined)}
            >
              <XMarkIcon className='w-6 h-6' />
            </button>
          </div>

          <h3 className='text-lg p-4 text-center break-words'>
            {proposal.title}
          </h3>

          <div
            className={`${theme === 'dark' ? 'bg-base-300' : 'bg-primary'} collapse collapse-arrow`}
          >
            <input className='p-0' type='checkbox' />
            <div className='collapse-title font-bold text-base'>Creator</div>
            <div className='collapse-content'>
              <Address
                size='base'
                address={feltToHex(proposal.creator_address) as `0x${string}`}
              />
            </div>
          </div>
        </article>

        <h2 className='text-lg mt-2 text-center font-semibold'>
          Total Votes <span className='font-bold'>{votesProposal?.length}</span>
        </h2>
        <div className='w-full join items-center justify-center pb-2'>
          <button
            className={`${optionSelected === 0 && 'btn-active'} btn btn-sm join-item`}
            onClick={() => setOptionSelected(0)}
          >
            Table
          </button>
          <button
            className={`${optionSelected === 1 && 'btn-active'} btn btn-sm join-item`}
            onClick={() => setOptionSelected(1)}
          >
            Chart
          </button>
        </div>
        <article className='flex flex-1 flex-col h-full overflow-auto'>
          {optionSelected === 0 ? (
            !isLoading ? (
              <motion.table
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className='table'
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>Address</th>
                    <th>Vote</th>
                    <th className='text-center'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {votesProposal?.map((x: VotedProposal, y: number) => (
                    <tr
                      key={y}
                      className={`${x.args.vote_choice ? 'bg-success/20' : 'bg-error/20'}`}
                    >
                      <th>{y + 1}</th>
                      <td className='p-5'>
                        <Address
                          size='base'
                          address={
                            feltToHex(x.args.voter_address) as `0x${string}`
                          }
                        />
                      </td>
                      <td className='font-semibold'>
                        {x.args.vote_choice ? 'Yes' : 'No'}
                      </td>
                      <td>
                        {
                          new Date(parseInt(x.args.date.toString()) * 1000)
                            .toISOString()
                            .split('T')[0]
                        }
                        &nbsp;
                        {new Date(parseInt(x.args.date.toString()) * 1000)
                          .toISOString()
                          .slice(11, 19)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </motion.table>
            ) : (
              <div className='flex justify-center items-center mt-20'>
                <span className='loading loading-dots scale-150' />
              </div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <StyledEngineProvider injectFirst>
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value: yesVotes,
                          color: '#05df72',
                          label: 'Yes',
                        },
                        {
                          id: 1,
                          value: noVotes,
                          color: '#ff6467',
                          label: 'No',
                        },
                      ],
                    },
                  ]}
                  slotProps={{ legend: { hidden: true } }}
                  height={250}
                  width={250}
                />
              </StyledEngineProvider>
            </motion.div>
          )}
        </article>
      </motion.div>
    </motion.section>
  );
};

export default ModalViewDetails;
