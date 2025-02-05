import { NextPage } from 'next';
import { RpcProvider } from 'starknet';
import { useEffect } from 'react';

type UserTableProps = {
  addressParsed: `0x${string}`;
};

const UserTable: NextPage<UserTableProps> = ({ addressParsed }) => {
  const getEvents = async () => {
    const provider = new RpcProvider({
      nodeUrl: `${process.env.NEXT_PUBLIC_PROVIDER_URL}`,
    });

    const lastBlock = await provider.getBlock('latest');
    // const keyFilter = [[num.toHex(hash.starknetKeccak('EventPanic')), '0x8']];

    const eventsList = await provider.getEvents({
      address: addressParsed,
      from_block: { block_number: lastBlock.block_number - 9 },
      to_block: { block_number: lastBlock.block_number },
      // keys: keyFilter,
      chunk_size: 10,
    });

    console.log('eventList', eventsList);
  };

  useEffect(() => {
    getEvents();
  });

  return (
    <>
      <h3 className='text-center text-2xl font-bold'>Users</h3>
      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className='hover'>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
