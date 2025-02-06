import { NextPage } from 'next';
import { useScaffoldEventHistory } from '~~/hooks/scaffold-stark/useScaffoldEventHistory';

type UserTableProps = {
  addressParsed: `0x${string}`;
};

const UserTable: NextPage<UserTableProps> = ({ addressParsed }) => {
  const { data: events } = useScaffoldEventHistory({
    contractName: 'DaoSphere',
    eventName: 'contracts::DaoSphere::DaoSphere::CreatedUser',
    fromBlock: 0n,
    watch: true,
    contractAddress: addressParsed,
  });

  return (
    <>
      <h3 className='text-center text-2xl font-bold'>Users</h3>
      <div className='overflow-x-auto lg:w-11/12 mx-auto'>
        <table className='table'>
          <thead className='text-center'>
            <tr>
              <th></th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {events.map((x, y) => (
              <tr key={y} className='hover'>
                <th>{y + 1}</th>
                <td>{x.args.address.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
