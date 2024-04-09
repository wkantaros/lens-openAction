import { ChainId } from '@decent.xyz/box-common';
import { Hex, decodeAbiParameters, encodeAbiParameters } from 'viem';

export const updateWraperParams = ({
  deadline,
  nonce,
  signature,
  data,
  chainId,
}: {
  nonce: bigint;
  deadline: bigint;
  signature: Hex;
  data: Hex;
  chainId: ChainId;
}) => {
  if (chainId != ChainId.POLYGON) {
    const decoded = decodeAbiParameters(bridgeAbi, data);
    const tokenWraperInstructions = decoded[0];
    tokenWraperInstructions.nonce = nonce;
    tokenWraperInstructions.signature = signature;
    tokenWraperInstructions.deadline = deadline;
    return encodeAbiParameters(bridgeAbi, [
      tokenWraperInstructions,
      decoded[1],
      decoded[2],
      decoded[3],
    ]);
  } else {
    const decoded = decodeAbiParameters(swapAbi, data);
    const tokenWraperInstructions = decoded[0];
    tokenWraperInstructions.nonce = nonce;
    tokenWraperInstructions.signature = signature;
    tokenWraperInstructions.deadline = deadline;
    return encodeAbiParameters(swapAbi, [
      tokenWraperInstructions,
      decoded[1],
      decoded[2],
      decoded[3],
    ]);
  }
};

const swapAbi = [
  {
    name: 'wrapperInstructions',
    type: 'tuple',
    internalType: 'struct TokenWrapperInstructions',
    components: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'srcToken', type: 'address', internalType: 'address' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
      { name: 'erc20ForFee', type: 'uint256', internalType: 'uint256' },
      { name: 'erc20Needed', type: 'uint256', internalType: 'uint256' },
      { name: 'nativeNeeded', type: 'uint256', internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', internalType: 'uint256' },
      { name: 'nonce', type: 'uint256', internalType: 'uint256' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' },
      { name: 'swapPath', type: 'bytes', internalType: 'bytes' },
    ],
  },
  {
    name: 'instructions',
    type: 'tuple',
    internalType: 'struct SwapAndExecuteInstructions',
    components: [
      {
        name: 'swapInstructions',
        type: 'tuple',
        internalType: 'struct SwapInstructions',
        components: [
          { name: 'swapperId', type: 'uint8', internalType: 'uint8' },
          { name: 'swapPayload', type: 'bytes', internalType: 'bytes' },
        ],
      },
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'paymentOperator', type: 'address', internalType: 'address' },
      { name: 'refund', type: 'address', internalType: 'address' },
      { name: 'payload', type: 'bytes', internalType: 'bytes' },
    ],
  },
  {
    name: 'feeData',
    type: 'tuple',
    internalType: 'struct FeeData',
    components: [
      { name: 'appId', type: 'bytes4', internalType: 'bytes4' },
      { name: 'affiliateId', type: 'bytes4', internalType: 'bytes4' },
      { name: 'bridgeFee', type: 'uint256', internalType: 'uint256' },
      {
        name: 'appFees',
        type: 'tuple[]',
        internalType: 'struct Fee[]',
        components: [
          { name: 'recipient', type: 'address', internalType: 'address' },
          { name: 'token', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  { name: 'signature', type: 'bytes', internalType: 'bytes' },
] as const;

const bridgeAbi = [
  {
    name: 'wrapperInstructions',
    type: 'tuple',
    internalType: 'struct TokenWrapperInstructions',
    components: [
      { name: 'from', type: 'address', internalType: 'address' },
      { name: 'srcToken', type: 'address', internalType: 'address' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
      { name: 'erc20ForFee', type: 'uint256', internalType: 'uint256' },
      { name: 'erc20Needed', type: 'uint256', internalType: 'uint256' },
      { name: 'nativeNeeded', type: 'uint256', internalType: 'uint256' },
      { name: 'deadline', type: 'uint256', internalType: 'uint256' },
      { name: 'nonce', type: 'uint256', internalType: 'uint256' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' },
      { name: 'swapPath', type: 'bytes', internalType: 'bytes' },
    ],
  },
  {
    name: 'instructions',
    type: 'tuple',
    internalType: 'struct BridgeInstructions',
    components: [
      {
        name: 'preBridge',
        type: 'tuple',
        internalType: 'struct SwapInstructions',
        components: [
          { name: 'swapperId', type: 'uint8', internalType: 'uint8' },
          { name: 'swapPayload', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'postBridge',
        type: 'tuple',
        internalType: 'struct SwapInstructions',
        components: [
          { name: 'swapperId', type: 'uint8', internalType: 'uint8' },
          { name: 'swapPayload', type: 'bytes', internalType: 'bytes' },
        ],
      },
      { name: 'bridgeId', type: 'uint8', internalType: 'uint8' },
      { name: 'dstChainId', type: 'uint256', internalType: 'uint256' },
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'paymentOperator', type: 'address', internalType: 'address' },
      { name: 'refund', type: 'address', internalType: 'address' },
      { name: 'payload', type: 'bytes', internalType: 'bytes' },
      { name: 'additionalArgs', type: 'bytes', internalType: 'bytes' },
    ],
  },
  {
    name: 'feeData',
    type: 'tuple',
    internalType: 'struct FeeData',
    components: [
      { name: 'appId', type: 'bytes4', internalType: 'bytes4' },
      { name: 'affiliateId', type: 'bytes4', internalType: 'bytes4' },
      { name: 'bridgeFee', type: 'uint256', internalType: 'uint256' },
      {
        name: 'appFees',
        type: 'tuple[]',
        internalType: 'struct Fee[]',
        components: [
          { name: 'recipient', type: 'address', internalType: 'address' },
          { name: 'token', type: 'address', internalType: 'address' },
          { name: 'amount', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
  },
  { name: 'signature', type: 'bytes', internalType: 'bytes' },
] as const;
