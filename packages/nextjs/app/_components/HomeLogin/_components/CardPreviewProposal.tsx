import { EyeIcon } from '@heroicons/react/24/outline';
import { NextPage } from 'next';
import { BlockieAvatar } from '~~/components/scaffold-stark';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useScaffoldWriteContract } from '~~/hooks/scaffold-stark/useScaffoldWriteContract';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { feltToHex } from '~~/utils/scaffold-stark/common';
import { getChecksumAddress } from 'starknet';
import { Proposal } from '~~/types/Proposal';
import { VotedProposalArgs } from '~~/types/VotedProposal';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [yesVotes, setYesVotes] = useState<number>(0);
  const [noVotes, setNoVotes] = useState<number>(0);
  const [percentageYes, setPercentageYes] = useState<number>(0);
  const [percentageNo, setPercentageNo] = useState<number>(0);
  const [voteParsed, setVoteParsed] = useState<VotedProposalArgs[]>([]);

  //smart contract
  const { address } = useAccount();
  
  const { sendAsync: setVoteProposal } = useScaffoldWriteContract({
    contractName: 'DaoSphere',
    functionName: 'set_vote_proposal',
    args: [proposal.proposal_id, false],
    contractAddress,
  });

  const { data: votesProposal } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_votes_proposal',
    args: [Number(proposal.proposal_id)],
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

  useEffect(() => {
    const yesVotes = votesProposal?.filter((x: any) => x.vote_choice === true);
    const noVotes = votesProposal?.filter(
      (x: any) => x.vote_choice === false && x.voter_address !== 0n
    );

    setYesVotes(yesVotes?.length ?? 0);
    setNoVotes(noVotes?.length ?? 0);
    setPercentageYes(
      ((yesVotes?.length ?? 0) / (votesProposal?.length ?? 0)) * 100
    );
    setPercentageNo(
      ((noVotes?.length ?? 0) / (votesProposal?.length ?? 0)) * 100
    );

    setVoteParsed(votesProposal as unknown as VotedProposalArgs[]);
  }, [votesProposal]);

  return (
    <article
      className={`${new Date(parseInt(proposal.end_time.toString()) * 1000) > new Date() ? 'bg-base-300' : 'bg-base-200'} card card-compact shadow-xl select-none p-2`}
    >
      <div className='card-body'>
        <h2 className='card-title'>
          Proposal ID: {proposal.proposal_id.toString()}
        </h2>
        <p className='m-0 text-sm truncate'>{proposal.title}</p>
        <div className='flex items-center gap-2'>
          <span>No</span>
          <progress
            className='progress progress-red'
            value={percentageNo}
            max='100'
          />
          <div className='flex'>
            <div className='avatar-group -space-x-6 rtl:space-x-reverse'>
              {Array.from({ length: noVotes })
                .slice(0, 3)
                .map((_, y) => (
                  <div className='avatar' key={y}>
                    <div className='w-6'>
                      <BlockieAvatar
                        address={feltToHex(voteParsed[y]?.voter_address)}
                        size={0}
                        ensImage={''}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span>Yes</span>
          <progress
            className='progress progress-success'
            value={percentageYes}
            max='100'
          />
          <div className='flex'>
            <div className='avatar-group -space-x-6 rtl:space-x-reverse'>
              {Array.from({ length: yesVotes })
                .slice(0, 3)
                .map((_, y) => (
                  <div className='avatar' key={y}>
                    <div className='w-6'>
                      <BlockieAvatar
                        address={feltToHex(voteParsed[y]?.voter_address)}
                        size={0}
                        ensImage={''}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {new Date(parseInt(proposal.end_time.toString()) * 1000) > new Date() &&
          !votesProposal?.find(
            (x: any) =>
              getChecksumAddress(feltToHex(x.voter_address)).toLowerCase() ==
              address?.toLowerCase()
          ) && (
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
