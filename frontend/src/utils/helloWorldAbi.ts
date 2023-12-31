export const helloWorldAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'actor',
        type: 'address',
      },
    ],
    name: 'Greet',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'string', name: 'message', type: 'string' },
      { internalType: 'address', name: 'actor', type: 'address' },
    ],
    name: 'helloWorld',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
