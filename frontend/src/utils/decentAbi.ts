export const decentAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_coreWrapper', type: 'address', internalType: 'address' },
      {
        name: '_lensHubProxyContract',
        type: 'address',
        internalType: 'address',
      },
      { name: '_metadataURI', type: 'string', internalType: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'HUB',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'coreWrapper',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getModuleMetadataURI',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initializePublicationAction',
    inputs: [
      { name: 'profileId', type: 'uint256', internalType: 'uint256' },
      { name: 'pubId', type: 'uint256', internalType: 'uint256' },
      { name: 'transactionExecutor', type: 'address', internalType: 'address' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'metadataURI',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'processPublicationAction',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        internalType: 'struct Types.ProcessActionParams',
        components: [
          {
            name: 'publicationActedProfileId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'publicationActedId',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'actorProfileId', type: 'uint256', internalType: 'uint256' },
          {
            name: 'actorProfileOwner',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'transactionExecutor',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'referrerProfileIds',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
          {
            name: 'referrerPubIds',
            type: 'uint256[]',
            internalType: 'uint256[]',
          },
          {
            name: 'referrerPubTypes',
            type: 'uint8[]',
            internalType: 'enum Types.PublicationType[]',
          },
          { name: 'actionModuleData', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'pubActions',
    inputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      { name: 'targetContract', type: 'address', internalType: 'address' },
      { name: 'tokenId', type: 'uint256', internalType: 'uint256' },
      { name: 'paymentToken', type: 'address', internalType: 'address' },
      { name: 'chainId', type: 'uint256', internalType: 'uint256' },
      { name: 'cost', type: 'uint256', internalType: 'uint256' },
      { name: 'signature', type: 'bytes', internalType: 'bytes' },
      { name: 'platformName', type: 'bytes', internalType: 'bytes' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setModuleMetadataURI',
    inputs: [{ name: '_metadataURI', type: 'string', internalType: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceID', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateCoreWrapper',
    inputs: [
      { name: '_coreWrapper', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'InitializedPublicationAction',
    inputs: [
      {
        name: 'profileId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'pubId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'transactionExecutor',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProcessedPublicationAction',
    inputs: [
      {
        name: 'publicationActedProfileId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'publicationActedId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'actorProfileId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'actorProfileOwner',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'NotHub', inputs: [] },
  { type: 'error', name: 'WrongBoxArgs', inputs: [] },
] as const;
