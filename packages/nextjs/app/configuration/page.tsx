'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from '~~/hooks/useAccount';
import { motion } from 'motion/react';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';
import ModalAdmin from './_components/ModalAdmin';
import TableUser from './_components/UserTable';
import { PlusIcon } from '@heroicons/react/20/solid';
import ModalAddUser from './_components/ModalAddUser';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { User } from '~~/types/User';
import ModalHandleUser from './_components/ModalHandleUser';

const Configuration: NextPage = () => {
  const { account } = useAccount();

  //states
  const [addressParsed, setAddressParsed] = useState<`0x${string}`>('0x0');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<User | undefined>(
    undefined
  );

  const [option, setOption] = useState(0);

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: addressParsed,
    functionName: 'is_admin',
    args: [account?.address],
  });

  const { data: users } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    contractAddress: addressParsed,
    functionName: 'get_users',
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
      {!isAdmin && <ModalAdmin />}

      <section className={`${!isAdmin ? 'blur-md' : ''}`}>
        {showAddUserModal && (
          <ModalAddUser
            contractAddress={addressParsed}
            adminAddress={account?.address}
            setShowAddUserModal={setShowAddUserModal}
          />
        )}
        {userSelected !== undefined && (
          <ModalHandleUser
            contractAddress={addressParsed}
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
        )}

        <article className='flex items-center w-full justify-center gap-5'>
        </article>

        {isAdmin && (
          <>
            {users !== undefined && users.length > 0 ? (
              <TableUser
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

            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => setShowAddUserModal(!showAddUserModal)}
              className='tooltip tooltip-left tooltip-primary absolute md:bottom-8 md:right-8 scale-110'
              data-tip='add user'
            >
              <button className='btn btn-circle '>
                <PlusIcon className='w-8 h-8' />
              </button>
            </motion.div>
          </>
        )}
      </section>
    </>
  );
};

export default Configuration;
