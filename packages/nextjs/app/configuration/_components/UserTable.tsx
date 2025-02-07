import { NoSymbolIcon } from '@heroicons/react/24/solid';
import { NextPage } from 'next';
import { Address } from '~~/components/scaffold-stark';
import { User } from '~~/types/User';
import { feltToHex } from '~~/utils/scaffold-stark/common';
import { LockOpenIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction } from 'react';

type UserTableProps = {
  users: User[];
  setUserSelected: Dispatch<SetStateAction<User | undefined>>;
};

const UserTable: NextPage<UserTableProps> = ({ users, setUserSelected }) => {
  return (
    <>
      <h3 className='text-center text-2xl font-bold'>Users</h3>

      <div className='overflow-x-auto lg:w-11/12 mx-auto'>
        <table className='table'>
          <thead className='text-center'>
            <tr>
              <th></th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {users.map((x, y) => (
              <tr key={y} className='hover'>
                <th>{y + 1}</th>
                <td className='flex justify-center p-5'>
                  <Address
                    address={feltToHex(BigInt(x.address)) as `0x${string}`}
                    disableAddressLink={true}
                    format='long'
                  />
                </td>
                <td>
                  <button
                    className={`${x.unlock ? 'btn-error' : 'btn-success'} btn btn-outline  hover:scale-110 transition-all delay-75`}
                    onClick={() => setUserSelected(x)}
                  >
                    {x.unlock ? (
                      <NoSymbolIcon className='size-4 stroke-red-500 stroke-10' />
                    ) : (
                      <LockOpenIcon className='size-4 stroke-green-500 stroke-10' />
                    )}
                    {x.unlock ? 'Block' : 'Unlock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
