import { EyeIcon } from '@heroicons/react/24/outline';
import { NextPage } from 'next';
import { BlockieAvatar } from '~~/components/scaffold-stark';
import { Proposal } from '~~/types/Proposal';
import { Dispatch, SetStateAction } from 'react';

type CardPreviewProposalProps = {
  proposal: Proposal;
  setProposalSelected: Dispatch<SetStateAction<Proposal | undefined>>;
};

const CardPreviewProposal: NextPage<CardPreviewProposalProps> = ({
  proposal,
  setProposalSelected,
}) => {
  return (
    <article className='card card-compact bg-base-300 shadow-xl select-none p-2'>
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
          <div className='flex'>
            <div className='avatar-group -space-x-6 rtl:space-x-reverse'>
              <div className='avatar'>
                <div className='w-6'>
                  <BlockieAvatar address={'0x023'} size={0} ensImage={''} />
                </div>
              </div>

              <div className='avatar'>
                <div className='w-6'>
                  <BlockieAvatar
                    address={proposal.creator_address.toString()}
                    size={0}
                    ensImage={''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span>Yes</span>
          <progress
            className='progress progress-success'
            value='78'
            max='100'
          />
          <div className='flex'>
            <div className='avatar-group -space-x-6 rtl:space-x-reverse'>
              <div className='avatar'>
                <div className='w-6'>
                  <BlockieAvatar address={'0x023'} size={0} ensImage={''} />
                </div>
              </div>

              <div className='avatar'>
                <div className='w-6'>
                  <BlockieAvatar
                    address={proposal.creator_address.toString()}
                    size={0}
                    ensImage={''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card-actions justify-center'>
          <button
            className='btn btn-sm btn-outline btn-ghost mt-2'
            onClick={() => setProposalSelected(proposal)}
          >
            <EyeIcon className='w-4 h-4' />
            Show Details
          </button>
        </div>
        {/* {new Date(parseInt(proposal.end_time.toString()) * 1000) <
          new Date() && (
          <div className='card-actions justify-center'>
            <button className='btn btn-primary'>Yes</button>
            <button className='btn btn-primary'>No</button>
          </div>
        )} */}
      </div>
    </article>
  );
};

export default CardPreviewProposal;
