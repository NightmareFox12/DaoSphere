import { NextPage } from 'next';
import { useScaffoldReadContract } from '~~/hooks/scaffold-stark/useScaffoldReadContract';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import CardPreviewProposal from './_components/CardPreviewProposal';
import { Proposal } from '~~/types/Proposal';

type HomeLoginProps = {
  address: `0x${string}` | undefined;
  daoAddress: `0x${string}` | null;
};

const HomeLogin: NextPage<HomeLoginProps> = ({ address, daoAddress }) => {
  //smart contract
  const { data: proposals } = useScaffoldReadContract({
    contractName: 'DaoSphere',
    functionName: 'get_my_proposals',
    args: [address],
    contractAddress: daoAddress as `0x${string}`,
  });

  return (
    <section className='flex flex-col h-screen'>
      <h2 className='text-2xl font-bold text-center'>My Proposals</h2>

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
          {proposals?.slice(0, 6).map((x: any, y: number) => (
            <SwiperSlide key={y} className='p-4'>
              <CardPreviewProposal proposal={x as Proposal} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button className='btn btn-sm btn-ghost mx-auto '>
        <p className='m-0 text-sm'>Show more</p>
      </button>
    </section>
  );
};

export default HomeLogin;
