import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';

type CardOptionsProps = {
  isAdmin: boolean;
  setOption: Dispatch<SetStateAction<number | undefined>>;
};

const CardOptions: NextPage<CardOptionsProps> = ({ setOption, isAdmin }) => {
  return (
    <section className='flex justify-center items-center w-full h-full absolute'>
      <article className='w-full flex justify-center items-center flex-col flex-wrap lg:gap-10 md:gap-4 gap-5 md:flex-row'>
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
          <>
            <article
              className='card w-96 cursor-pointer shadow-xl border-2 border-gradient hover:scale-105 transition-all delay-75'
              onClick={() => setOption(2)}
            >
              <div className='card-body'>
                <h2 className='card-title'>Supervisors</h2>
                <p className='font-light'>
                  Manage supervisors and permissions.
                </p>
              </div>
            </article>

            <article
              className='card w-96 cursor-pointer shadow-xl border-2 border-gradient hover:scale-105 transition-all delay-75'
              onClick={() => setOption(3)}
            >
              <div className='card-body'>
                <h2 className='card-title'>Data</h2>
                <p className='font-light'>
                  Manage data and permissions.
                </p>
              </div>
            </article>
          </>
        )}
      </article>
    </section>
  );
};

export default CardOptions;
