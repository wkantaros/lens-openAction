import { Address, decodeAbiParameters, hexToString } from 'viem';
import { uiConfig } from './constants';
import { PostCreatedEventFormatted } from './types';

export const fetchParams = (post: PostCreatedEventFormatted) => {
  const actionModules = post.args.postParams.actionModules;
  const index = actionModules.indexOf(uiConfig.decentOpenActionContractAddress);
  if (index < 0) return;
  const actionModuleInitData = post.args.postParams.actionModulesInitDatas[
    index
  ] as Address;

  const InitData = [
    {
      name: 'data',
      type: 'tuple',
      internalType: 'struct InitializedAction',
      components: [
        { name: 'targetContract', type: 'address', internalType: 'address' },
        { name: 'tokenId', type: 'uint256', internalType: 'uint256' },
        { name: 'paymentToken', type: 'address', internalType: 'address' },
        { name: 'chainId', type: 'uint256', internalType: 'uint256' },
        { name: 'cost', type: 'uint256', internalType: 'uint256' },
        {
          name: 'publishingClientProfileId',
          type: 'uint256',
          internalType: 'uint256',
        },
        { name: 'signature', type: 'bytes', internalType: 'bytes' },
        { name: 'platformName', type: 'bytes', internalType: 'bytes' },
      ],
    },
  ] as const;

  const decodedInitData = decodeAbiParameters(
    InitData,
    actionModuleInitData
  )[0];
  return decodedInitData;
};
