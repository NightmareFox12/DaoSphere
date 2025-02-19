export interface VotedProposal {
  args: VotedProposalArgs;
}

export interface VotedProposalArgs {
  proposal_id: number;
  voter_address: bigint;
  vote_choice: boolean;
  date: number;
}
