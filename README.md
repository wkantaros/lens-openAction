# Lens Hello World Smart Post

This repo contains an e2e example of how to integrate a Lens Smart Post to call an arbitrary function on an external contract, leveraging Decent's Open Action

- [Integration Guide](#integration-guide)

- [Frontend](#frontend)

## Integration Guide

The deployed action module addresses are:

- [Polygon Mainnet](https://polygonscan.com/address/0x99Cd5A6e51C85CCc63BeC61A177003A551953628)

- [Mumbai Testnet](https://mumbai.polygonscan.com/address/0x48Cc077E082365F1be696cAad2ccF91cEb08D9f9)

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
        // note: can use getCommonSignatureFromString to simplify process for certain common NFT types
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
const actionModules = post.args.postParams.actionModules;
const index = actionModules.indexOf(uiConfig.decentOpenActionContractAddress);

// viem
const decodedInitializeDataViem = decodeAbiParameters(
    [
      { type: 'address' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'string' },
    ],
    actionModuleInitData
  );
)

```

To allow users to execute this action, an integration should display whatever relevant data is needed from the initialize step. In the repo example, this is the cost of the transaction, the address of the nft to mint, the chain the contract is on, and button to trigger the action.

When the button is pressed, `act` should be called on the `LensHub` contract, with relavent fields:

- publicationActedProfileId - Profile ID of action publisher, `args.postParams.profileId`

- publicationActedId - ID of publication with this action attached, `args.pubId`

- actionModuleAddress - module contract address from above

- actionModuleData - bytes data, for this action there is one parameter encoded, a string containing an action message (which is also contained in the Hello World event output)

For a complete example (which shows how to fetch the correct actionModuleData) of executing this open action on a publication with viem, see [here](https://github.com/wkantaros/lens-openAction/blob/main/frontend/src/layout/Act.tsx)

## Frontend

To run locally, clone repo, switch to frontend directory, and run `yarn install && yarn run dev`

Contract address are configured in `frontend/src/constants.ts`

The `frontend/src/layout` components `Create`, and `Act` contain code to create a post with this action and execute this action on a post

Copy `.env.example` to `.env` in frontend directory, input environment variables, and run `source .env` (or equivalent on your OS).

// notes:

using yarn v1.22.21 + node v18.18.2
