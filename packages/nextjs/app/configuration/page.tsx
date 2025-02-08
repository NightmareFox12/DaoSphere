'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from '~~/hooks/useAccount';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import CardOptions from './_components/CardOptions';
import UserConfig from './userConfig/page';
import ModalAdminOrSupervisor from './_components/ModalAdminOrSupervisor';
import SupervisorConfig from './supervisorConfig/page';

const Configuration: NextPage = () => {
  const { account } = useAccount();

  //states
  const [addressParsed, setAddressParsed] = useState<`0x${string}`>('0x0');

  const [option, setOption] = useState<number | undefined>(undefined);

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: addressParsed,
    functionName: 'is_admin',
    args: [account?.address],
  });

  const { data: isSupervisor } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: addressParsed,
    functionName: 'is_supervisor',
    args: [account?.address],
  });

  useEffect(() => {
    const address = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);
    if (address !== null) {
      const addressParsed: `0x${string}` = `0x${address.slice(2)}`;
      setAddressParsed(addressParsed);
    }
  }, []);

  return (
    <>
      {!isAdmin && !isSupervisor && <ModalAdminOrSupervisor />}

      {/* TODO: VERIFICAR SI ES ADMIN O SUPERVISOR */}
      <section className={`${!isAdmin && !isSupervisor ? 'blur-md' : ''}`}>
        {option === undefined && (
          <CardOptions
            setOption={setOption}
            isAdmin={isAdmin as unknown as boolean}
          />
        )}

        {option === 1 && (
          <UserConfig
            addressParsed={addressParsed}
            account={account}
            setOption={setOption}
          />
        )}

        {option === 2 && (
          <SupervisorConfig
            addressParsed={addressParsed}
            account={account}
            setOption={setOption}
          />
        )}
      </section>
    </>
  );
};

export default Configuration;
