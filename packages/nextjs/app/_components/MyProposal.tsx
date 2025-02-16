import { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

type MyProposalProps = {
  address: `0x${string}` | undefined;
  daoAddress: `0x${string}` | null;
};

const MyProposal: NextPage<MyProposalProps> = ({ address, daoAddress }) => {
  //smart contract
  const { data: proposals } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_my_proposals',
    args: [address],
    contractAddress: daoAddress as `0x${string}`,
  });
  console.log(proposals);



  return <div>{proposals?.toString()}</div>;
};

export default MyProposal;
