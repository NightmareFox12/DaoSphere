'use client';
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'ethers';
import { motion } from 'motion/react';
import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { InputBase } from '~~/components/scaffold-stark';
import { useScaffoldMultiWriteContract } from '~~/hooks/scaffold-stark/useScaffoldMultiWriteContract';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { useAccount } from '~~/hooks/useAccount';
import { VoteOptions } from '~~/types/VoteOptions';
import { DAO_ADDRESS_LOCALSTORAGE_KEY } from '~~/utils/Constants';

const Proposal: NextPage = () => {
  //states
  const [contractAddress, setContractAddress] = useState<`0x${string}`>('0x0');
  // const [selectedToken, setSelectedToken] = useState<'ETH' | 'STRK'>('STRK');

  const [isNotification, setIsNotification] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0]
  );
  const [isYesNoVote, setIsYesNoVote] = useState<boolean>(true);
  const [nextId, setNextId] = useState(1);
  const [options, setOptions] = useState<VoteOptions[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //smart contract
  const { address: userAddress } = useAccount();

  const { data: proposalCount } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'proposal_count',
    contractAddress: contractAddress,
  });

  const { data: userBalance } = useScaffoldReadContract({
    contractName: 'Strk',
    functionName: 'balance_of',
    args: [userAddress],
  });

  const { sendAsync: sendProposalBasic } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: 'Strk',
        functionName: 'transfer',
        args: [contractAddress, parseEther('1')],
      },
      {
        contractName: 'DaoSphere',
        functionName: 'create_proposal_basic',
        contractAddress: contractAddress,
        args: [title, BigInt(new Date(endDate).getTime() / 1000)],
      },
    ],
  });

  // efects
  useEffect(() => {
    const contractAddress = localStorage.getItem(DAO_ADDRESS_LOCALSTORAGE_KEY);

    if (contractAddress !== null) {
      setContractAddress(contractAddress as `0x${string}`);
    }
  }, []);

  //functions
  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: nextId,
        description: '',
      },
    ]);
    setNextId(nextId + 1);
  };

  const handleEditOption = (id: number, description: string) => {
    setOptions(
      options.map((option) => {
        if (option.id === id) {
          return { ...option, description };
        }
        return option;
      })
    );
  };

  const handleDeleteOption = (id: number) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleCreateProposal = async () => {
    try {
      setIsLoading(true);
      if (isYesNoVote) {
        // await sendProposalBasic({
        //   args: [title, BigInt(new Date(endDate).getTime() / 1000)],
        // });
        await sendProposalBasic();
      } else {
      }
      setTitle('');
      setEndDate(
        new Date(new Date().setDate(new Date().getDate() + 1))
          .toISOString()
          .split('T')[0]
      );
      setIsYesNoVote(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='w-full h-full flex flex-1 justify-center items-center'>
      <article
        className={`${options.length > 0 && 'mt-10'} flex flex-col bg-base-300 border border-gradient rounded-xl p-5 lg:w-7/12`}
      >
        <div className='flex justify-between items-center'>
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-center text-2xl font-bold mb-5'>
              Proposal {proposalCount?.toString()}
            </p>
          </div>

          {/* <div
            className='tooltip tooltip-primary tooltip-top'
            data-tip='By pressing the notification button, you will activate automatic alerts that will inform you every time a new vote is registered.'
          >
            <button
              className={`${isNotification && 'btn-active'} btn btn-circle btn-outline`}
              onClick={() => setIsNotification(!isNotification)}
            >
              <AnimatePresence>
                {isNotification ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BellAlertIcon className='w-6 h-6' />
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BellIcon className='w-6 h-6' />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div> */}
        </div>
        <div className='w-full px-8 flex flex-col gap-8 my-4'>
          <div className='flex flex-col'>
            <p className='text-lg m-1 font-bold'>
              Title <span className='text-error font-bold'>*</span>
            </p>
            <InputBase placeholder='Title' value={title} onChange={setTitle} />
            <p className='text-sm text-error m-1 ps-1'>
              {title.length > 0 &&
                title.length < 5 &&
                'Title must be at least 5 characters'}
            </p>
          </div>

          <div>
            <p className='text-lg m-1 font-bold'>
              End Date <span className='text-error font-bold'>*</span>
            </p>
            <label className='input input-bordered flex items-center gap-2'>
              <input
                type='date'
                className='grow'
                placeholder='End Date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={
                  new Date(new Date().setDate(new Date().getDate() + 1))
                    .toISOString()
                    .split('T')[0]
                }
                max={
                  new Date(new Date().setDate(new Date().getDate() + 30))
                    .toISOString()
                    .split('T')[0]
                }
              />
            </label>
          </div>

          {/* <div className='join w-full flex justify-center gap-1'>
            <button
              className={`${isYesNoVote && 'btn-active'} join-item btn btn-outline px-10`}
              onClick={() => setIsYesNoVote(true)}
            >
              Yes/No Vote
            </button>
            <button
              className={`${!isYesNoVote && 'btn-active'} join-item btn btn-outline`}
              onClick={() => setIsYesNoVote(false)}
            >
              Multiple Choice Vote
            </button>
          </div>
*/}
          {!isYesNoVote && (
            <article className='flex flex-col justify-center items-center gap-3'>
              <p className='text-xl m-1 font-bold'>Options</p>

              {options.map((option, y) => (
                <div
                  className='collapse collapse-arrow bg-base-200 p-1'
                  key={y}
                >
                  <input type='checkbox' />
                  <div className='collapse-title text-lg font-medium'>
                    {option.description === ''
                      ? 'Click to show/hide option 😉'
                      : option.description}
                  </div>
                  <div className='collapse-content flex gap-5'>
                    <div className='flex-1'>
                      <InputBase
                        placeholder='Option'
                        value={option.description}
                        onChange={(e) => handleEditOption(option.id, e)}
                      />
                    </div>

                    <div className='flex-2'>
                      <button
                        className='btn btn-circle btn-error btn-outline'
                        onClick={() => handleDeleteOption(option.id)}
                      >
                        <TrashIcon className='w-6 h-6' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                className='mt-2 btn btn-accent btn-circle'
                onClick={handleAddOption}
              >
                <PlusIcon className='w-6 h-6' />
              </button>
            </article>
          )}
        </div>
        <button
          className='mt-5 btn btn-accent mx-auto px-16'
          onClick={handleCreateProposal}
          disabled={
            isLoading ||
            title === '' ||
            endDate === '' ||
            (isYesNoVote ? false : options.length <= 0) ||
            parseInt(formatEther(userBalance?.toString() ?? '0')) < 1
          }
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className='w-6 h-6 animate-spin' />
              Creating Proposal...
            </>
          ) : (
            'Create Proposal'
          )}
        </button>
        {parseInt(formatEther(userBalance?.toString() ?? '0')) < 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className='flex justify-center items-center gap-2'
          >
            <Image src='/strk.png' width={20} height={20} alt='warning' />
            <p className='text-error font-bold m-0'>
              You need to have STRK Sepolia to create a proposal
            </p>
          </motion.div>
        )}
      </article>
    </section>
  );
};

export default Proposal;
