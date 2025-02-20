import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  UserGroupIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
import WalletButtonCopy from './_components/WalletButtonCopy';
import Image from 'next/image';

const About = () => {
  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='text-center mb-12'>
        <Image
          src='/logo.png'
          alt='DAOSPHERE Logo'
          width={300}
          height={300}
          className='mx-auto mb-4 w-40 h-auto'
        />
        <p className='text-lg w-9/12 mx-auto'>
          Decentralized Application (dApp) designed to make it easier for DAOs
          to make decisions to resolve problems or cases that affect them. To do
          this, a voting system is used that is transparent, effective and
          secure, eliminating the need for a central body to solve problems.
          Instead, each member has a say within the DAO.
        </p>
      </div>

      <section className='grid gap-8 lg:grid-cols-2'>
        <div className='bg-base-300 shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 outline outline-1 outline-secondary'>
          <div className='flex items-center mb-4'>
            <CheckCircleIcon className='h-8 w-8 mr-2 text-green-600' />
            <h2 className='text-2xl font-semibold'>Justification 📋</h2>
          </div>
          <p className='mt-2'>
            🌐 The need to create a &quot Voting System&quot that is completely
            decentralized arises from the constant pursuit of increasing
            transparency and trust in decision-making processes. A DAO
            represents an evolution in organizational governance, as it promotes
            member participation, which minimizes the possibility of corruption
            by a central authority.
          </p>
          <p className='mt-2'>
            🤝 Therefore, DaoSphere is part of this important trend, offering
            its users a platform that integrates the opportunity to influence
            the important decisions of the DAO to which they belong,
            guaranteeing fair resolutions and reflecting the collective
            consensus.
          </p>
        </div>

        <div className='bg-base-300 shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-500  outline outline-1 outline-secondary'>
          <div className='flex items-center mb-4'>
            <ClipboardDocumentListIcon className='h-8 w-8 mr-2 text-red-600' />
            <h2 className='text-2xl font-semibold'>Functionality 📋</h2>
          </div>
          <ul className='list-disc pl-5'>
            <li className='mb-2'>
              📝 <span className='font-bold'>DAO Registration:</span> This step
              will be carried out by the DAO Administrator. When registration is
              completed successfully, the DAO is recognized within the dApp.
            </li>
            <li className='mb-2'>
              🧑‍🤝‍🧑 <span className='font-bold'>Adding members:</span> Once the DAO
              is registered, the administrator can add the members of the
              organization. Members will be able to actively participate in
              voting.
            </li>
            <li className='mb-2'>
              📋 <span className='font-bold'>Registration of problems:</span>{' '}
              The problems or cases to be resolved can be registered on the
              platform. This allows them to be subject to the Voting System.
            </li>
          </ul>
        </div>

        <div className='bg-base-300 shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-500  outline outline-1 outline-secondary'>
          <div className='flex items-center mb-4'>
            <UserGroupIcon className='h-8 w-8 mr-2 text-blue-700' />
            <h2 className='text-2xl font-semibold'>
              Functional Requirements 📝
            </h2>
          </div>
          <ul className='list-disc pl-5'>
            <li className='mb-2'>
              🛡️{' '}
              <span className='font-bold'>User Authentication by Wallet:</span>{' '}
              Through a Wallet like Braavos, DaoSphere Users will be able to log
              in to our dApp, guaranteeing the security and protection of their
              data.
            </li>
            <li className='mb-2'>
              📝 <span className='font-bold'>Registration of DAOs:</span> DAOs
              may be registered in the dApp by their respective Administrator.
              This process grants the DAO access to all available functionality.
            </li>
            <li className='mb-2'>
              🔏 <span className='font-bold'>Member Registration:</span> DAO
              members must register in order to obtain the right to vote during
              discussions.
            </li>
            <li className='mb-2'>
              🗳️ <span className='font-bold'>Issue Registration:</span> Any
              issue that needs to be submitted for discussion among DAO members
              can be registered in the dApp. Always guaranteeing transparency in
              each of these extremely important processes.
            </li>
          </ul>
        </div>

        <div className='bg-base-300 shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-500  outline outline-1 outline-secondary'>
          <div className='flex items-center mb-4'>
            <InformationCircleIcon className='h-8 w-8 mr-2 text-yellow-700' />
            <h2 className='text-2xl font-semibold'>
              Non-Functional Requirements 🌟
            </h2>
          </div>
          <ul className='list-disc pl-5 mt-2'>
            <li className='mb-2'>
              <span className='font-bold'>Scalability 📈:</span> The system must
              handle the growing number of DAOs, members, and voting activities
              without performance degradation.
            </li>
            <li className='mb-2'>
              <span className='font-bold'>Security 🔒:</span> Data must be
              protected using encryption and secure authentication mechanisms to
              prevent unauthorized access and ensure user data privacy.
            </li>
            <li className='mb-2'>
              <span className='font-bold'>Performance ⚡:</span> The application
              should provide a seamless user experience with fast response
              times, even under peak loads.
            </li>
            <li className='mb-2'>
              <span className='font-bold'>Reliability 🛠️:</span> The system must
              ensure high availability and uptime, minimizing downtime to
              maintain trust among users.
            </li>
            <li className='mb-2'>
              <span className='font-bold'>Usability 🖥️:</span> The user
              interface must be intuitive and user-friendly, allowing users to
              easily navigate and perform tasks within the dApp.
            </li>
            <li className='mb-2'>
              <span className='font-bold'>Maintainability 🔧:</span> The
              codebase should be modular and well-documented to facilitate easy
              maintenance, updates, and debugging.
            </li>
          </ul>
        </div>
      </section>

      <div className='mt-12 text-center'>
        <h2 className='text-3xl font-bold mb-6'>Developers 👨‍💻</h2>
        <section className='grid gap-8 lg:grid-cols-2'>
          <div className='bg-base-300 shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 outline outline-1 outline-secondary'>
            <div className='flex items-center mb-4'>
              <CodeBracketIcon className='h-8 w-8 mr-2 text-secondary' />
              <h3 className='text-xl font-semibold'>Lead Developer 👨‍💻</h3>
            </div>
            <p className='text-lg mb-4'>
              Carlos Henriquez is a highly experienced developer in smart
              contract and dApp development.
            </p>
            <a
              href='https://github.com/NightmareFox12'
              target='_blank'
              className='inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out'
            >
              GitHub Profile
            </a>

            <div className='flex items-center mb-4 mt-4'>
              <ClipboardIcon className='h-8 w-8 mr-2 text-secondary' />
              <h3 className='text-xl font-semibold'>Wallets 🪙</h3>
            </div>

            <div className='mt-4 flex flex-col items-center space-y-4'>
              <WalletButtonCopy
                icon={'https://i.postimg.cc/8CHfp9ck/MetaMask.jpg'}
                text='MetaMask'
                walletName='0xD2692F9df925D18D527ABe8b3d99EE9E9C8d75AE'
              />
              <WalletButtonCopy
                icon={'https://i.postimg.cc/HkLk0nkm/argent.png'}
                text='Argent X'
                walletName='0x05F423DFA4EbD3B342A11fC1EeCD1a9b6D31aCdb591DBA5ad38eA8aBd3461F99'
              />
            </div>
          </div>

          <div className='bg-base-300 shadow-lg rounded-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 outline outline-1 outline-secondary'>
            <div className='flex items-center mb-4'>
              <DocumentTextIcon className='h-8 w-8 mr-2 text-secondary' />
              <h3 className='text-xl font-semibold'>
                Developer / Documentation 📑
              </h3>
            </div>
            <p className='text-lg mb-4'>
              Miguel Rodriguez is a technical writer and developer with a
              background in smart contracts.
            </p>
            <a
              href='https://github.com/Echizen512'
              target='_blank'
              className='inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out'
            >
              GitHub Profile
            </a>

            <div className='flex items-center mb-4 mt-4'>
              <ClipboardIcon className='h-8 w-8 mr-2 text-secondary' />
              <h3 className='text-xl font-semibold'>Wallets 🪙</h3>
            </div>

            <div className='mt-4 flex flex-col items-center space-y-4'>
              <WalletButtonCopy
                icon={'https://i.postimg.cc/8CHfp9ck/MetaMask.jpg'}
                text='MetaMask'
                walletName='0x6aD90bB24ed985F3876aDE9AE09381b1Cd180548'
              />
              <WalletButtonCopy
                icon={'https://i.postimg.cc/5Nb00nc6/Braavos.png'}
                text='Braavos'
                walletName='0x0482bb852374844577a9a8f9d90bab84839658b332552b31eca2a3bd7d2d5942'
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
