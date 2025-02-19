import { EyeIcon } from '@heroicons/react/24/outline';
import { NextPage } from 'next';
import { BlockieAvatar } from '~~/components/scaffold-stark';
import { Proposal } from '~~/types/Proposal';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTheme } from 'next-themes';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';

type CardPreviewProposalProps = {
  proposal: Proposal;
  setProposalSelected: Dispatch<SetStateAction<Proposal | undefined>>;
  contractAddress: `0x${string}`;
};

const CardPreviewProposal: NextPage<CardPreviewProposalProps> = ({
  proposal,
  setProposalSelected,
  contractAddress,
}) => {
  const { theme } = useTheme();

  //states
  const [vote, setVote] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //smart contract
  const { sendAsync: setVoteProposal } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'set_vote_proposal',
    args: [proposal.proposal_id, false],
    contractAddress,
  });

  const handleVoteProposal = async (vote: boolean) => {
    try {
      setIsLoading(true);
      setVoteProposal({ args: [proposal.proposal_id, vote] });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article
      className={`${new Date(parseInt(proposal.end_time.toString()) * 1000) > new Date() ? 'bg-base-300' : 'bg-base-200'} card card-compact shadow-xl select-none p-2`}
    >
      <div className='card-body'>
        <h2 className='card-title'>
          Proposal ID: {proposal.proposal_id.toString()}
        </h2>
        <p className='text-sm truncate'>{proposal.title}</p>
        <div className='flex items-center gap-2'>
          <span>No</span>
          <progress className='progress progress-red' value='53' max='100' />
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

        {new Date(parseInt(proposal.end_time.toString()) * 1000) >
          new Date() && (
          <div className='card-actions justify-center'>
            <button
              onClick={() => handleVoteProposal(true)}
              className={`${theme === 'dark' ? 'btn-success btn-outline ' : 'outline outline-1 outline-green-500 hover:bg-green-500 text-green-500 hover:text-black'} btn btn-sm btn-ghost hover:scale-110 transition-all duration-300 delay-75`}
              disabled={isLoading}
            >
              Yes
            </button>
            <button
              className={`${theme === 'dark' ? 'btn-error btn-outline ' : 'outline outline-1 outline-red-500 hover:bg-red-500 text-red-500 hover:text-black'} btn btn-sm btn-ghost hover:scale-110 transition-all duration-300 delay-75`}
              onClick={() => handleVoteProposal(false)}
              disabled={isLoading}
            >
              No
            </button>
          </div>
        )}
        <div className='card-actions justify-center'>
          <button
            className='btn btn-sm btn-outline btn-ghost mt-2'
            onClick={() => setProposalSelected(proposal)}
          >
            <EyeIcon className='w-4 h-4' />
            Show Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default CardPreviewProposal;
