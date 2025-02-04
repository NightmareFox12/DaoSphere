'use client';
import { DropdownMenu, Button } from '@radix-ui/themes';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FaucetMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant='outline'>
          Faucet <ChevronDownIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>
          <a href='https://starknet-faucet.vercel.app/'>Sepolia</a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
