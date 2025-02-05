import { Dispatch, SetStateAction } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { AddressInput } from '~~/components/scaffold-stark';
import { XMarkIcon } from '@heroicons/react/24/outline';

type ModalAddUserProps = {
  newUserAddress: string;
  setShowAddUserModal: Dispatch<SetStateAction<boolean>>;
  setNewUserAddress: Dispatch<SetStateAction<string>>;
};

const ModalAddUser: NextPage<ModalAddUserProps> = ({
  newUserAddress,
  setNewUserAddress,
  setShowAddUserModal,
}) => {
  const router = useRouter();
  //?AQUI DEBO TRAER EL SHOWOPEN DE LA PAGE PARA PODER CERRAR Y ABRIR, LUEGO EN EL CONTRACT
  //? COLOR EL CREAR USUARIO Y MOSTRAR EL EVENTO
  return (
    <dialog className=' modal' open>
      <div className='flex flex-col gap-5 bg-base-300 p-10 rounded-lg border border-primary'>
        <div className='flex w-full justify-between'>
          <h3 className='font-bold text-xl'>Add user</h3>
          <XMarkIcon
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-all delay-75 ease-in-out'
            onClick={() => setShowAddUserModal(false)}
          />
        </div>

     

        <div className='flex justify-center'>
          <button
            className='btn btn-primary px-10'
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className='w-4 h-4 font-bold' />
            Create User
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAddUser;
