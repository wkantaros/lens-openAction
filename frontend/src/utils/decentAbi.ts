export const decentAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_coreWrapper',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_lensHubProxyContract',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'WrongBoxArgs',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pubId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'transactionExecutor',
        type: 'address',
      },
    ],
    name: 'InitializedPublicationAction',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'publicationActedProfileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'publicationActedId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'actorProfileId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'actorProfileOwner',
        type: 'address',
      },
    ],
    name: 'ProcessedPublicationAction',
    type: 'event',
  },
  {
    inputs: [],
    name: 'HUB',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'coreWrapper',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getModuleMetadataURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'profileId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pubId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'transactionExecutor',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'initializePublicationAction',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'metadataURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationActedProfileId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'publicationActedId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'actorProfileId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address',
          },
          {
            internalType: 'uint256[]',
            name: 'referrerProfileIds',
            type: 'uint256[]',
          },
          {
            internalType: 'uint256[]',
            name: 'referrerPubIds',
            type: 'uint256[]',
          },
          {
            internalType: 'enum Types.PublicationType[]',
            name: 'referrerPubTypes',
            type: 'uint8[]',
          },
          {
            internalType: 'bytes',
            name: 'actionModuleData',
            type: 'bytes',
          },
        ],
        internalType: 'struct Types.ProcessActionParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'processPublicationAction',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'pubActions',
    outputs: [
      {
        internalType: 'address',
        name: 'targetContract',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'paymentToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'cost',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_metadataURI',
        type: 'string',
      },
    ],
    name: 'setModuleMetadataURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceID',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_coreWrapper',
        type: 'address',
      },
    ],
    name: 'updateCoreWrapper',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;