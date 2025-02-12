'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from '~~/hooks/useAccount';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import CardOptions from './_components/CardOptions';
import UserConfig from './userConfig/page';
import ModalAdminOrSupervisor from './_components/ModalAdminOrSupervisor';
import SupervisorConfig from './advisorConfig/page';
import DataConfig from './dataConfig/page';

const Configuration: NextPage = () => {
  const { account } = useAccount();

  //states
  const [contractAddress, setContractAddress] = useState<`0x${string}`>('0x0');
  const [option, setOption] = useState<number | undefined>(undefined);

  //smart contract
  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_admin',
    args: [account?.address],
  });

  const { data: isAdvisor } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'is_advisor',
    args: [account?.address],
  });

  useEffect(() => {
    const address = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (address !== null) {
      const contractAddress: `0x${string}` = `0x${address.slice(2)}`;
      setContractAddress(contractAddress);
    }
  }, []);

  useEffect(() => {
    if (account?.address !== undefined) {
      setOption(isAdvisor && option === 2 ? undefined : option);
    }
  }, [account?.address, isAdvisor, option]);

  return (
    <>
      {!isAdmin && !isAdvisor && <ModalAdminOrSupervisor />}

      <section className={`${!isAdmin && !isAdvisor ? 'blur-md' : ''}`}>
        {option === undefined && (
          <CardOptions
            setOption={setOption}
            isAdmin={isAdmin as unknown as boolean}
          />
        )}

        {option === 1 && (
          <UserConfig
            contractAddress={contractAddress}
            setOption={setOption}
          />
        )}

        {option === 2 && (
          <SupervisorConfig
            contractAddress={contractAddress}
            setOption={setOption}
          />
        )}

        {option === 3 && (
          <DataConfig
            contractAddress={contractAddress}
            setOption={setOption}
          />
        )}
      </section>
    </>
  );
};

export default Configuration;
