import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';

type CardOptionsProps = {
  isAdmin: boolean;
  setOption: Dispatch<SetStateAction<number | undefined>>;
};

const CardOptions: NextPage<CardOptionsProps> = ({ setOption, isAdmin }) => {
  return (
    <section className='w-full h-full absolute flex lg:gap-10 md:gap-4 gap-5 justify-center items-center flex-col md:flex-row mx-2'>
      <article
        className='card w-96 cursor-pointer shadow-xl border-2 border-gradient hover:scale-105 transition-all delay-75'
        onClick={() => setOption(1)}
      >
        <div className='card-body'>
          <h2 className='card-title'>Users</h2>
          <p className='font-light'>Manage users and their permissions.</p>
        </div>
      </article>

      {isAdmin && (
        <article
          className='card w-96 cursor-pointer shadow-xl border-2 border-gradient hover:scale-105 transition-all delay-75'
          onClick={() => setOption(2)}
        >
          <div className='card-body'>
            <h2 className='card-title'>Supervisors</h2>
            <p className='font-light'>Manage supervisors and permissions.</p>
          </div>
        </article>
      )}
    </section>
  );
};

export default CardOptions;
