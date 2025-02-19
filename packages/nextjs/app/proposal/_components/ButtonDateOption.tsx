import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';

type ButtonDateOptionProps = {
  dateOption: number | undefined;
  setDateOption: Dispatch<SetStateAction<number | undefined>>;
};

const ButtonDateOption: NextPage<ButtonDateOptionProps> = ({
  dateOption,
  setDateOption,
}) => {
  return (
    <div>
      <div className='join w-full flex justify-center gap-1'>
        <button
          className={`${dateOption && dateOption === 5 && 'btn-active'} join-item btn btn-sm btn-outline`}
          onClick={() => setDateOption(5)}
        >
          5 minutes
        </button>

        <button
          className={`${dateOption && dateOption === 15 && 'btn-active'} join-item btn btn-sm btn-outline`}
          onClick={() => setDateOption(15)}
        >
          15 minutes
        </button>

        <button
          className={`${dateOption && dateOption === 30 && 'btn-active'} join-item btn btn-sm btn-outline`}
          onClick={() => setDateOption(30)}
        >
          30 minutes
        </button>

        <button
          className={`${dateOption && dateOption === 60 && 'btn-active'} join-item btn btn-sm btn-outline`}
          onClick={() => setDateOption(60)}
        >
          1 hour
        </button>
        <button
          className={`${dateOption === undefined && 'btn-active'} join-item btn btn-sm btn-outline`}
          onClick={() => setDateOption(undefined)}
        >
          Custom Date
        </button>
      </div>
    </div>
  );
};

export default ButtonDateOption;
