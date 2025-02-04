import { NextPage } from 'next';
import { CustomConnectButton } from './scaffold-stark/CustomConnectButton';

const ModalConnectWallet: NextPage = () => {
  return (
    <dialog className='modal' open>
      <div className='bg-base-300 p-10 rounded-lg border border-primary'>
        <h3 className='font-bold text-lg'>Connect your wallet 🤓</h3>
        <p className='py-4 font-semibold'>
          Please, connect your wallet to continue 🎯
        </p>

        <div className='flex justify-center'>
          <CustomConnectButton />
        </div>
      </div>
    </dialog>
  );
};

export default ModalConnectWallet;