import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { NextPage } from 'next';
import { useTheme } from 'next-themes';
import { Dispatch, SetStateAction } from 'react';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';
import { Proposal } from '~~/types/Proposal';
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
  //smart contract
  const { data: proposalVotes } = useScaffoldEventHistory({
    contractName: 'DaoSphere',
    eventName: 'contracts::DaoSphere::DaoSphere::VotedProposal',
    contractAddress,
    filters: {
      proposal_id: proposal.proposal_id,
    },
    fromBlock: 0n,
    watch: true,
  });

  console.log(proposalVotes);

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
        className='bg-base-100 w-full sm:w-8/12 h-full overflow-auto rounded-3xl m-10 p-5 outline outline-2 outline-accent'
      >
        <div className='p-1 flex justify-between items-center'>
          <h2 className='font-bold text-lg'>Proposal Details</h2>
          <button
            className='btn btn-circle btn-outline'
            onClick={() => setProposalSelected(undefined)}
          >
            <XMarkIcon className='w-6 h-6' />
          </button>
        </div>

        <h3 className='text-lg p-8 text-center break-words'>
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

        <h2 className='text-lg mt-2 text-center break-words'>Votes</h2>
        <div className=''>
          <table className='table'>
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Vote</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {proposalVotes?.map((x, y) => (
                <tr key={y}>
                  <th>{y + 1}</th>
                  {/* <td>{feltToHex(x.voter_address)}</td> */}
                  <td>{x.vote_choice ? 'Yes' : 'No'}</td>
                  {/* <td>
                    {new Date(
                      parseInt(x.date.toString()) * 1000
                    ).toLocaleDateString()}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ModalViewDetails;
