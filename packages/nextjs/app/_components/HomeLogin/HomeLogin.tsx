import { NextPage } from 'next';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import CardPreviewProposal from './_components/CardPreviewProposal';
import { Proposal } from '~~/types/Proposal';
import ModalViewDetails from './_components/ModalViewDetails';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

type HomeLoginProps = {
  address: `0x${string}` | undefined;
  daoAddress: `0x${string}` | null;
};

const HomeLogin: NextPage<HomeLoginProps> = ({ address, daoAddress }) => {
  //states
  const [proposalSelected, setProposalSelected] = useState<
    Proposal | undefined
  >(undefined);

  //smart contract
  const { data: myProposals } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_my_proposals',
    args: [address],
    contractAddress: daoAddress as `0x${string}`,
  });

  const { data: openProposals } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_open_proposals',
    contractAddress: daoAddress as `0x${string}`,
  });

  return (
    <section className='flex flex-col'>
      <AnimatePresence>
        {proposalSelected && (
          <ModalViewDetails
            proposal={proposalSelected}
            setProposalSelected={setProposalSelected}
            contractAddress={daoAddress as `0x${string}`}
          />
        )}
      </AnimatePresence>

      <h2 className='text-2xl font-bold text-center'>My Proposals</h2>
      {myProposals && myProposals.length > 0 ? (
        <>
          <div className='w-full px-2'>
            <Swiper
              modules={[Navigation]}
              spaceBetween={25}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {myProposals?.slice(0, 6).map((x: any, y: number) => (
                <SwiperSlide key={y} className='p-4'>
                  <CardPreviewProposal
                    proposal={x as Proposal}
                    setProposalSelected={setProposalSelected}
                    contractAddress={daoAddress as `0x${string}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <button className='btn btn-sm btn-ghost mx-auto '>
            <p className='m-0 text-sm'>Show more</p>
          </button>
        </>
      ) : (
        <section className='flex flex-col'>
          <h2 className='text-lg font-bold text-center'>No proposal created</h2>
        </section>
      )}

      <h2 className='text-2xl font-bold text-center'>Open Proposals</h2>
      {openProposals && openProposals.length > 0 ? (
        <>
          <div className='w-full px-2'>
            <Swiper
              modules={[Navigation]}
              spaceBetween={25}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {openProposals?.slice(0, 6).map((x: any, y: number) => (
                <SwiperSlide key={y} className='p-4'>
                  <CardPreviewProposal
                    proposal={x as Proposal}
                    setProposalSelected={setProposalSelected}
                    contractAddress={daoAddress as `0x${string}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <button className='btn btn-sm btn-ghost mx-auto '>
            <p className='m-0 text-sm'>Show more</p>
          </button>
        </>
      ) : (
        <section className='flex flex-col'>
          <h2 className='text-lg font-bold text-center'>No proposal created</h2>
        </section>
      )}
    </section>
  );
};

export default HomeLogin;
