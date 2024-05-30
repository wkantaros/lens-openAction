import { useState } from 'react';
import {
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  parseUnits,
  zeroAddress,
} from 'viem';
import { currChainId, uiConfig } from '../utils/constants';
import { lensHubAbi } from '../utils/abis/lensHubAbi';
import { useWalletClient } from 'wagmi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChainId,
  getCommonSignatureFromString,
  getCommonSignature,
  CommonNftType,
} from '@decent.xyz/box-common';
import { useDecentOA } from '@/context/DecentOAContext';
import { publicClient } from '@/main';

export const Create = () => {
  const { address, profileId, refresh } = useDecentOA();
  const { data: walletClient } = useWalletClient();
  const [createState, setCreateState] = useState<string | undefined>();
  const [freeCollect, setFreeCollect] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [uri, setURI] = useState<string>(
    'https://upload.wikimedia.org/wikipedia/commons/1/17/University_of_Virginia_seal.svg'
  );
  const [nftType, setNftType] = useState<string>('Decent');
  const [dstChainId, setDstChainId] = useState<number>(ChainId.POLYGON);
  const [nftAddress, setNftAddress] = useState<string>(
    uiConfig.nfts.maticNftCost0_1
  );
  const [cost, setCost] = useState<string>('0.1');
  // other example nft
  // const [nftType, setNftType] = useState<string>('Decent');
  // const [dstChainId, setDstChainId] = useState<number>(ChainId.ARBITRUM);
  // const [nftAddress, setNftAddress] = useState<string>(
  //   uiConfig.nfts.arbitrumNft0_00005
  // );
  // const [cost, setCost] = useState<string>('0.00005');

  const createPost = async () => {
    // this can be done in a handful of ways either by calling
    // getCommonSignature: and selecting the CommonNftType enum from dropdown in the frontend or
    // getCommonSignatureFromString: this is more flexible for ppl who want to pass
    //                               in arbitrary function signatures / no dropdown
    const nftSignature: string = getCommonSignatureFromString(nftType);

    if (!profileId) return;
    // our encoded abi parameters
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
    const encodedInitData = encodeAbiParameters(InitData, [
      {
        targetContract: nftAddress as `0x${string}`,
        tokenId: 0n,
        paymentToken: zeroAddress,
        chainId: BigInt(dstChainId),
        cost: parseUnits(cost, 18),
        publishingClientProfileId: BigInt(profileId),
        signature: encodePacked(['string'], [nftSignature]),
        platformName: encodePacked(['string'], ['ExampleRepo']),
      },
    ]);

    const actionModulesInitDatas = [encodedInitData];
    // get the decent open action
    const actionModules = [uiConfig.decentOpenActionContractAddress];
    if (freeCollect) {
      const baseFeeCollectModuleTypes = [
        { type: 'uint160' },
        { type: 'uint96' },
        { type: 'address' },
        { type: 'uint16' },
        { type: 'bool' },
        { type: 'uint72' },
        { type: 'address' },
      ];

      const encodedBaseFeeCollectModuleInitData = encodeAbiParameters(
        baseFeeCollectModuleTypes,
        [0, 0, zeroAddress, 0, false, 0, zeroAddress]
      );

      const encodedCollectActionInitData = encodeAbiParameters(
        [{ type: 'address' }, { type: 'bytes' }],
        [
          uiConfig.simpleCollectModuleContractAddress,
          encodedBaseFeeCollectModuleInitData,
        ]
      );
      actionModulesInitDatas.push(encodedCollectActionInitData);
      actionModules.push(uiConfig.collectActionContractAddress);
    }

    // Post parameters
    const args = {
      profileId: BigInt(profileId!),
      contentURI: uri,
      actionModules,
      actionModulesInitDatas,
      referenceModule:
        '0x0000000000000000000000000000000000000000' as `0x${string}`,
      referenceModuleInitData: '0x01' as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: 'post',
      args: [args],
    });

    setCreateState('PENDING IN WALLET');
    try {
      const hash = await walletClient!.sendTransaction({
        to: uiConfig.lensHubProxyAddress,
        account: address,
        data: calldata,
      });
      setCreateState('PENDING IN MEMPOOL');
      setTxHash(hash);
      const result = await publicClient({
        chainId: currChainId,
      }).waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        setCreateState('SUCCESS');
        refresh();
      } else {
        setCreateState('CREATE TXN REVERTED');
      }
    } catch (e) {
      setCreateState(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <>
      <div className="pb-4">
        {address && profileId && (
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col">
              <p className="my-2">Content URI (link to content for the post)</p>
              <Input
                type="text"
                value={uri}
                placeholder="URI"
                onChange={(e) => setURI(e.target.value)}
              />
              <p className="my-2">Initialize contract address</p>
              <Input
                placeholder="Types: Zora, Sound, or Manifold"
                type="string"
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
              />
              <p className="my-2">Chain</p>
              <select
                name="chain"
                id="chainSelect"
                onChange={(e) => {
                  setDstChainId(parseInt(e.target.value));
                  console.log(parseInt(e.target.value));
                }}
                className="border p-2"
              >
                <option value={ChainId.POLYGON}>Polygon</option>
                <option value={ChainId.ARBITRUM}>Arbitrum</option>
                <option value={ChainId.ETHEREUM}>Ethereum</option>
                <option value={ChainId.OPTIMISM}>Optimism</option>
                <option value={ChainId.BASE}>Base</option>
                <option value={ChainId.POLYGON_TESTNET}>Mumbai</option>
                <option value={ChainId.GOERLI}>Goerli</option>
              </select>
              <p className="my-2">Cost</p>
              <Input
                placeholder="Types: Zora, Sound, or Manifold"
                type="string"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
              <p className="my-2">Contract Type</p>
              <Input
                placeholder="Types: Zora, Sound, or Manifold"
                type="string"
                value={nftType}
                onChange={(e) => setNftType(e.target.value)}
              />
              <div className="my-3 mx-auto">
                <input
                  type="checkbox"
                  id="filterCheckbox"
                  className="mr-3 cursor-pointer"
                  checked={freeCollect}
                  onChange={(e) => setFreeCollect(e.target.checked)}
                />
                <label htmlFor="filterCheckbox">Enable free collects</label>
              </div>
              <Button className="mt-3" onClick={createPost}>
                Create
              </Button>
            </div>
            {createState && <p className="create-state-text">{createState}</p>}
            {txHash && (
              <a
                href={`${uiConfig.blockExplorerLink}${txHash}`}
                className="block-explorer-link"
                target="_blank"
              >
                Block Explorer Link
              </a>
            )}
            <Button
              variant={'outline'}
              className="my-3"
              onClick={() => {
                setTxHash(undefined);
                setURI('');
                setCreateState(undefined);
              }}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
