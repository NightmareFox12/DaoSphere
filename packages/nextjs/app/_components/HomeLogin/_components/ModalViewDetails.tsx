import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';
import { Address } from '~~/components/scaffold-stark';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { Proposal } from '~~/types/Proposal';
import { feltToHex } from '~~/utils/scaffold-stark/common';

type ModalViewDetailsProps = {
  proposal: Proposal;
  setProposalSelected: Dispatch<SetStateAction<Proposal | undefined>>;
};

const ModalViewDetails: NextPage<ModalViewDetailsProps> = ({
  proposal,
  setProposalSelected,
}) => {
  //smart contract
  // const { data: proposalVotes } = useScaffoldReadContract({
  //   contractName: 'DaoSphere',
  //   functionName: 'get_votes_proposal',
  //   args: [proposal.id],
  // });

  // console.log(proposalVotes);

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

        <div className='collapse collapse-arrow bg-primary'>
          <input className='p-0' type='checkbox' />
          <div className='collapse-title font-bold text-base'>Creator</div>
          <div className='collapse-content'>
            <Address
              size='base'
              address={feltToHex(proposal.creator_address) as `0x${string}`}
            />
          </div>
        </div>

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
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ModalViewDetails;
