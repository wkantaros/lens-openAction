# Lens Hello World Smart Post

This repo contains smart contracts and a UI which demonstrates a Lens Smart Post to call an arbitrary function on an external contract, leveraging Decent's Open Action

The Polygon mainnet version of the site is live [here](https://lens-hello-world-open-action.vercel.app/)

- [Integration Guide](#integration-guide)

- [Frontend](#frontend)

- [Smart Contracts](#smart-contracts)

## Integration Guide

The deployed action module addresses are:

- [Polygon Mainnet](https://polygonscan.com/address/0xA9d72bCAd216b1F05d7D60b46Fd8dC01D501257a)

- [Mumbai Testnet](https://mumbai.polygonscan.com/address/0x5bF5269c2F5983a3a72F2bFc69D5f07530138CBd)

To integrate this open action, support must be added to create and execute the action.

### Create Post

To create a publication with this action module attached there are two relavent fields:

`actionModules` - array of addresses which should contain module addresses above ^

`actionModuleInitDatas` - array of bytes data, for this action there is one parameter, a string containing an initialize message (which is contained in the Hello World event output)

An integration for this action should display an input box for the initialize string and encode it to be passed in the initDatas as follows:

```
// viem
const encodedInitData = encodeAbiParameters(
    [
        // contract address of call (i.e. your nft address)
        { type: 'address' },
        // the payment token for the action (i.e.mint) zeroAddress if cost is native or free
        { type: 'address' },
        // chainId of that contract (137 if your nft is on polygon, 10 if op, etc)
        // can use ChainId enum from @decent.xyz/box-common for convenience
        { type: 'uint256' },
        // cost of the function call (0 if free)
        { type: 'uint256' },
        // the function signature
        // i.e. 'function mint(address to, uint256 numberOfTokens)'
        // note: can use getCommonSignatureFromString to simplify process
        { type: 'bytes' },
    ],
    [
        nftAddress as `0x${string}`,
        zeroAddress,
        BigInt(dstChainId),
        parseUnits(cost, 18),
        encodePacked(['string'], [nftSignature]),
    ]
);
```

For a complete example of creating a post with this open action module with viem, see [here](https://github.com/wkantaros/lens-openAction/blob/main/frontend/src/layout/Create.tsx)

### Execute

A publication with this open action will contain the module address and initialize data from the "Create Post" step contained in it's `postParams` field. To decode the initialize string:

```
const index = actionModules.indexOf(openActionContractAddress);
const actionModuleInitData = post.args.postParams.actionModulesInitDatas[index];

// viem
const decodedInitializeDataViem = decodeAbiParameters(
  [
    { type: 'string' },
  ],
  actionModuleInitData,
)

```

To allow users to execute this action, an integration should display the decoded initialize string, an input box for the user to set an action string, and button which trigger the action.

When the button is pressed, `act` should be called on the `LensHub` contract, with relavent fields:

- publicationActedProfileId - Profile ID of action publisher, `args.postParams.profileId`

- publicationActedId - ID of publication with this action attached, `args.pubId`

- actionModuleAddress - module contract address from above

- actionModuleData - bytes data, for this action there is one parameter encoded, a string containing an action message (which is also contained in the Hello World event output)

The actionModuleData can be encoded identically to the initializeData.

For a complete example of executing this open action on a publication with viem, see [here](https://github.com/wkantaros/lens-openAction/blob/main/frontend/src/layout/Act.tsx)


## Frontend

To run locally, clone repo, switch to frontend directory, and run `yarn install && yarn run dev`

Contract address are configured in `frontend/src/constants.ts`

The `frontend/src/layout` components `Create`, and `Act` contain code to create a post with this action and execute this action on a post

Copy `.env.example` to `.env` in frontend directory, input environment variables, and run `source .env` (or equivalent on your OS).

// notes:

using yarn v1.22.21 + node v18.18.2
