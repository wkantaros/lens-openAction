import { PERMIT2_ADDRESS, AllowanceProvider } from '@uniswap/Permit2-sdk';

import { Address } from 'viem';
import { uiConfig } from './constants';
import { ChainId } from '@decent.xyz/box-common';
import { GetWalletClientResult } from 'wagmi/actions';
import { ethers } from 'ethers';

export const getAllowanceData = async ({
  token,
  owner,
  spender,
}: {
  token: Address;
  owner: Address;
  spender: Address;
}) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://polygon.llamarpc.com',
    137
  );
  const allowanceProvider = new AllowanceProvider(provider, PERMIT2_ADDRESS);
  return await allowanceProvider.getAllowanceData(token, owner, spender);
};

export const constructPermit2Sig = async ({
  amount,
  token,
  from,
}: {
  amount: bigint;
  token: Address;
  from: Address;
}) => {
  const spender = uiConfig.decentOpenActionContractAddress;
  const { nonce } = await getAllowanceData({
    token,
    owner: from,
    spender,
  });
  console.log(nonce);

  const PERMIT2_DOMAIN_NAME = 'Permit2';
  const permit2Address = '0x000000000022D473030F116dDEE9F6B43aC78BA3';
  const domain = {
    name: PERMIT2_DOMAIN_NAME,
    chainId: ChainId.POLYGON,
    verifyingContract: permit2Address as `0x${string}`,
  };

  const TOKEN_PERMISSIONS = [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
  ];

  const PERMIT_TRANSFER_FROM_TYPES = {
    PermitTransferFrom: [
      { name: 'permitted', type: 'TokenPermissions' },
      { name: 'spender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    TokenPermissions: TOKEN_PERMISSIONS,
  };

  // const PERMIT_EXPIRATION = timeToMilliseconds(30, 'd');
  const PERMIT_SIG_EXPIRATION = timeToMilliseconds(30, 'min');
  const permitTransfer = {
    permitted: {
      token,
      amount,
    },
    spender: spender as `0x${string}`,
    nonce: 2n,
    deadline: toDeadline(PERMIT_SIG_EXPIRATION),
  } as const;
  return { domain, types: PERMIT_TRANSFER_FROM_TYPES, values: permitTransfer };
};

export const signPermitSignature = async (
  walletClient: GetWalletClientResult,
  amount: bigint,
  token: `0x${string}`
) => {
  if (walletClient == null) throw new Error('no wallet client found');
  const from = walletClient.account.address;
  const { domain, types, values } = await constructPermit2Sig({
    amount,
    token,
    from,
  });

  const signature = await walletClient.signTypedData({
    domain,
    types,
    primaryType: 'PermitTransferFrom',
    message: values,
  });
  return {
    signature,
    nonce: values.nonce,
    deadline: values.deadline,
  };
};

function timeToMilliseconds(
  value: number,
  unit: 'ms' | 's' | 'min' | 'h' | 'd'
): number {
  const timeInMilliseconds = new Date();
  switch (unit) {
    case 'ms':
      timeInMilliseconds.setMilliseconds(value);
      break;
    case 's':
      timeInMilliseconds.setSeconds(value);
      break;
    case 'min':
      timeInMilliseconds.setMinutes(value);
      break;
    case 'h':
      timeInMilliseconds.setHours(value);
      break;
    case 'd':
      timeInMilliseconds.setDate(value);
      break;
    default:
      throw new Error('Invalid time unit');
  }
  return timeInMilliseconds.getTime();
}

/**
 * Converts an expiration (in milliseconds) to a deadline (in seconds) suitable for the EVM.
 * Permit2 expresses expirations as deadlines, but JavaScript usually uses milliseconds,
 * so this is provided as a convenience function.
 */
function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}
