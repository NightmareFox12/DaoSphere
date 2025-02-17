import { NextPage } from 'next';
import { Proposal } from '~~/types/Proposal';

type CardProposalProps = {
  proposal: Proposal;
};

const CardProposal: NextPage<CardProposalProps> = ({ proposal }) => {
  return (
    <div className='card card-compact bg-base-100 shadow-xl select-none'>
      <div className='card-body'>
        <h2 className='card-title'>
          Proposal ID: {proposal.proposal_id.toString()}
        </h2>
        <p>{proposal.title.toString()}</p>

          <div className='flex items-center gap-2'>
            <span>No</span>
            <progress
              className='progress progress-secondary'
              value='53'
              max='100'
            />
          </div>
          <div className='flex items-center gap-2'>
            <span>Yes</span>
            <progress
              className='progress progress-success'
              value='78'
              max='100'
            />
          </div>
        {new Date(parseInt(proposal.end_time.toString()) * 1000) <
          new Date() && (
          <div className='card-actions justify-center'>
            <button className='btn btn-primary'>Yes</button>
            <button className='btn btn-primary'>No</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProposal;
