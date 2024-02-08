import { Address } from 'viem';
import { ChainId } from '@decent.xyz/box-common';

export const network: string = 'polygon'; // options: 'polygon', 'mumbai'
// export const network: string = 'mumbai';
export const currChainId =
  network == 'mumbai' ? ChainId.POLYGON_TESTNET : ChainId.POLYGON;

// mode flag sets whether to fetch smart post instances from Lens API or querying directly from contract events
// Mumbai open actions are always indexed on the Lens API, Polygon actions need to be allowlisted on the API (though they are permisionless on-chain)
// To request allowlist for Polygon actions, you can submit a PR to https://github.com/lens-protocol/open-actions-directory
// export const mode: string = 'events'; // options: 'api', 'events'
export const mode: string = 'events';
export const ipfsGateway = 'https://ipfs.io/ipfs/';
export const arweaveGateway = 'https://arweave.net/';

interface UiConfig {
  openActionContractAddress: Address;
  openActionContractStartBlock: number;
  lensHubProxyAddress: Address;
  collectActionContractAddress: Address;
  simpleCollectModuleContractAddress: Address;
  blockExplorerLink: string;
  rpc: string;
  decentOpenActionContractAddress: Address;
  decentStartBlock: number;
  wMatic: Address;
  nfts?: any;
}

export const uiConfig: UiConfig =
  network === 'polygon'
    ? {
        openActionContractAddress: '0x7c4fAeef5ba47a437DFBaB57C016c1E706F56fcf',
        openActionContractStartBlock: 53241942,
        lensHubProxyAddress: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
        collectActionContractAddress:
          '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB',
        simpleCollectModuleContractAddress:
          '0x060f5448ae8aCF0Bc06D040400c6A89F45b488bb',
        blockExplorerLink: 'https://polygonscan.com/tx/',
        rpc: `https://polygon-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_POLYGON_API_KEY
        }`,
        decentOpenActionContractAddress:
          '0x14860D0495CAF16914Db10117D4111AC4Da2F0a5',
        decentStartBlock: 53241942,
        wMatic: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        // test nfts
        nfts: {
          maticNftCost0_1: '0xf7d3ddffae7ec2576c9a6d95fe7d0f79c480c721',
          arbitrumNft0_00005: '0x3007E0eB44222AC69E1D3c93A9e50F9CA73F53a1',
        },
      }
    : {
        openActionContractAddress: '0x038D178a5aF79fc5BdbB436daA6B9144c669A93F',
        openActionContractStartBlock: 45661514,
        lensHubProxyAddress: '0x4fbffF20302F3326B20052ab9C217C44F6480900',
        collectActionContractAddress:
          '0x4FdAae7fC16Ef41eAE8d8f6578d575C9d64722f2',
        simpleCollectModuleContractAddress:
          '0x345Cc3A3F9127DE2C69819C2E07bB748dE6E45ee',
        blockExplorerLink: 'https://mumbai.polygonscan.com/tx/',
        rpc: `https://polygon-mumbai.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_MUMBAI_API_KEY
        }`,
        decentOpenActionContractAddress:
          '0xe310b5Ed0B3c19B1F0852Ce985a4C38BAE738FDb',
        decentStartBlock: 45661514,
        wMatic: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
        // test nfts
        nfts: {
          freeGoerliNft: '0xe8F7f424eA3A3872E1bC5F5ACa826c95d9473FDc',
          freeMumbaiNft: '0xB6BcD4A4c3F4D5f58D08a7a6Ae296E4Fa83A80aa',
          paidMumbaiNft_0_00001: '0x0d75e4e3ed05931aad36725f7b2436076d2baab0',
        },
      };
