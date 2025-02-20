'use client'

import { NextPage } from 'next';
import { motion } from 'motion/react';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction, useState } from 'react';
import { User } from '~~/types/User';
import ModalAddUser from './_components/ModalAddUser';
import ModalHandleUser from './_components/ModalHandleUser';
import UserTable from './_components/UserTable';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';

type UserConfigProps = {
  contractAddress: `0x${string}`;
  setOption: Dispatch<SetStateAction<number | undefined>>;
};

const UserConfig: NextPage<UserConfigProps> = ({
  contractAddress,
  setOption,
}) => {
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<User | undefined>(undefined);

  //smart contract
  const { data: users } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: contractAddress,
    functionName: 'get_users',
  });

  return (
    <>
      {showAddUserModal && (
        <ModalAddUser
          contractAddress={contractAddress}
          setShowAddUserModal={setShowAddUserModal}
        />
      )}
      {userSelected !== undefined && (
        <ModalHandleUser
          contractAddress={contractAddress}
          userSelected={userSelected}
          setUserSelected={setUserSelected}
        />
      )}

      <div className='relative w-full flex justify-between items-center p-4'>
        <button
          className='btn btn-circle btn-accent hover:scale-110 transition-all delay-75'
          onClick={() => setOption(undefined)}
        >
          <ArrowLeftIcon className='w-8 h-8' />
        </button>
        <motion.div
          whileHover={{ scale: 1.2 }}
          onClick={() => setShowAddUserModal(!showAddUserModal)}
          className='tooltip tooltip-left tooltip-primary'
          data-tip='add user'
        >
          <button className='btn btn-circle btn-accent'>
            <PlusIcon className='w-8 h-8' />
          </button>
        </motion.div>
      </div>

      <article className='flex items-center w-full justify-center gap-5'></article>

      <>
        {users !== undefined && users.length > 0 ? (
          <UserTable
            users={users as unknown as User[]}
            setUserSelected={setUserSelected}
          />
        ) : (
          <div className='w-full flex items-center justify-center flex-col'>
            <h1 className='text-2xl font-bold text-center'>
              No users registered
            </h1>
            <motion.button
              className='btn btn-primary px-10'
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowAddUserModal(!showAddUserModal)}
            >
              Add User
            </motion.button>
          </div>
        )}

    
      </>
    </>
  );
};

export default UserConfig;
