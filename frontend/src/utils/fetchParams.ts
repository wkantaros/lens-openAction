import { Address, decodeAbiParameters } from 'viem';
import { uiConfig } from './constants';
import { PostCreatedEventFormatted } from './types';

export const fetchParams = (post: PostCreatedEventFormatted) => {
  const actionModules = post.args.postParams.actionModules;
  const index = actionModules.indexOf(uiConfig.decentOpenActionContractAddress);
  if (index < 0) return;
  const actionModuleInitData = post.args.postParams.actionModulesInitDatas[
    index
  ] as Address;

  const decodedInitData = decodeAbiParameters(
    [
      { type: 'address' },
      { type: 'uint256' },
      { type: 'address' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'string' },
      { type: 'string' },
    ],
    actionModuleInitData
  );
  return decodedInitData;
};
