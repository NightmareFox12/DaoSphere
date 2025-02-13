'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  BugAntIcon,
  ArrowLeftStartOnRectangleIcon,
  Cog8ToothIcon,
  HomeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { useOutsideClick } from '~~/hooks/scaffold-stark';
import { CustomConnectButton } from '~~/components/scaffold-stark/CustomConnectButton';
import { useTargetNetwork } from '~~/hooks/scaffold-stark/useTargetNetwork';
import { devnet } from '@starknet-react/chains';
import { SwitchTheme } from './SwitchTheme';
import { useAccount, useNetwork, useProvider } from '@starknet-react/core';

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: 'Home',
    href: '/',
    icon: <HomeIcon className='h-4 w-4' />,
  },
  {
    label: 'Proposal',
    href: '/proposal',
    icon: <PencilSquareIcon className='h-4 w-4' />,
  },
  {
    label: 'Configuration',
    href: '/configuration',
    icon: <Cog8ToothIcon className='h-4 w-4' />,
  },
  {
    label: 'Close sesion',
    href: '/close-session',
    icon: <ArrowLeftStartOnRectangleIcon className='h-4 w-4' />,
  },
  {
    label: 'Debug Contracts',
    href: '/debug',
    icon: <BugAntIcon className='h-4 w-4' />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive
                  ? '!bg-gradient-nav !text-white active:bg-gradient-nav shadow-md'
                  : ''
              } py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col hover:bg-gradient-nav hover:text-white`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    //@ts-expect-error refs are supposed to be null by default
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), [])
  );

  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.network === devnet.network;

  const { provider } = useProvider();
  const { address, status, chainId } = useAccount();
  const { chain } = useNetwork();
  const [isDeployed, setIsDeployed] = useState(true);

  useEffect(() => {
    if (
      status === 'connected' &&
      address &&
      chainId === targetNetwork.id &&
      chain.network === targetNetwork.network
    ) {
      provider
        .getClassHashAt(address)
        .then((classHash) => {
          if (classHash) setIsDeployed(true);
          else setIsDeployed(false);
        })
        .catch((e) => {
          console.error('contreact cehc', e);
          if (e.toString().includes('Contract not found')) {
            setIsDeployed(false);
          }
        });
    }
  }, [
    status,
    address,
    provider,
    chainId,
    targetNetwork.id,
    targetNetwork.network,
    chain.network,
  ]);

  return (
    <div className='lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 px-0 sm:px-2'>
      <div className='navbar-start w-auto -mr-2'>
        <div className='lg:hidden dropdown' ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost 
              [@media(max-width:379px)]:!px-3 [@media(max-width:379px)]:!py-1 
              [@media(max-width:379px)]:!h-9 [@media(max-width:379px)]:!min-h-0
              [@media(max-width:379px)]:!w-10
              ${isDrawerOpen ? 'hover:bg-secondary' : 'hover:bg-transparent'}`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className='h-1/2' />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-100'
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link
          href='/'
          passHref
          className='hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0'
        >
          <div className='flex relative w-10 h-10 bg-transparent'>
            <Image
              alt='SE2 logo'
              className='cursor-pointer object-contain'
              width={100}
              height={100}
              src='/logo.png'
            />
          </div>
          <div className='flex flex-col'>
            <span className='font-bold leading-tight'>Scaffold-Stark</span>
            <span className='text-xs'>Starknet dev stack</span>
          </div>
        </Link>
        <ul className='hidden lg:flex lg:flex-wrap menu menu-horizontal px-1 gap-2'>
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className='navbar-end flex-grow mr-2 gap-4'>
        {status === 'connected' && !isDeployed ? (
          <span className='bg-[#8a45fc] text-[9px] p-1 text-white'>
            Wallet Not Deployed
          </span>
        ) : null}
        <CustomConnectButton />
        <SwitchTheme
          className={`pointer-events-auto ${
            isLocalNetwork ? 'mb-1 lg:mb-0' : ''
          }`}
        />
      </div>
    </div>
  );
};
