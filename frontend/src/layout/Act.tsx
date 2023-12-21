import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  zeroAddress,
} from 'viem';
import { useWalletClient } from 'wagmi';
import { publicClient } from '../main';
import { currChainId, mode, uiConfig } from '../utils/constants';
import { lensHubAbi } from '../utils/lensHubAbi';
import { serializeLink } from '../utils/serializeLink';
import { PostCreatedEventFormatted } from '../utils/types';
import { useDecentOA } from '@/context/DecentOAContext';
import { fetchParams } from '@/utils/fetchParams';
import { ActionType } from '@decent.xyz/box-common';
import { UseBoxActionArgs, useBoxAction } from '@decent.xyz/box-hooks';
import { approveToken, getAllowance } from '@/tokenUtils';
//import { ProfileId } from "@lens-protocol/metadata";

const ActionBox = ({
  post,
  address,
  profileId,
  refresh,
}: {
  post: PostCreatedEventFormatted;
  address?: `0x${string}`;
  profileId?: number;
  refresh: () => void;
}) => {
  const [createState, setCreateState] = useState<string | undefined>();
  const [txHash, setTxHash] = useState<string | undefined>();
  const { data: walletClient } = useWalletClient();
  const [contract, token, dstChain, cost, signature] = fetchParams(post)!;
  console.log(contract, token, dstChain, cost, signature);
  const dstChainId = parseInt(dstChain.toString());
  const getActionArgs: UseBoxActionArgs = {
    actionType: ActionType.LensOpenAction,
    actionConfig: {
      functionCall: 'processPublicationAction',
      pubId: post.args.pubId,
      contractAddress: contract,
      chainId: dstChainId,
      cost: {
        isNative: true,
        amount: cost,
      },
      signature,
      args: [address, 1n],
    },
    srcChainId: currChainId,
    sender: address!,
    slippage: 3, // 1%
    srcToken: uiConfig.wMatic,
    dstToken: token,
    dstChainId: dstChainId,
  };

  // what to call
  const resp = useBoxAction(getActionArgs);

  const executeDecentOA = async (post: PostCreatedEventFormatted) => {
    if (!resp || resp.isLoading) return;
    console.log('post!', post);
    console.log('mf', resp);
    const encodedActionData = resp.actionResponse!.arbitraryData.lensActionData;

    const args = {
      publicationActedProfileId: BigInt(post.args.postParams.profileId || 0),
      publicationActedId: BigInt(post.args.pubId),
      actorProfileId: BigInt(profileId || 0),
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: uiConfig.decentOpenActionContractAddress,
      actionModuleData: encodedActionData as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: 'act',
      args: [args],
    });

    setCreateState('PENDING IN WALLET');
    try {
      console.log(
        'approval token',
        resp.actionResponse?.tokenPayment?.tokenAddress,
        uiConfig.wMatic
      );
      if (
        resp.actionResponse?.tokenPayment?.tokenAddress &&
        resp.actionResponse.tokenPayment.tokenAddress != zeroAddress
      ) {
        const amountApproved = await getAllowance({
          user: address!,
          spender: uiConfig.decentOpenActionContractAddress,
          token: resp.actionResponse.tokenPayment.tokenAddress as `0x${string}`,
        });
        if (
          amountApproved < (resp.actionResponse?.tokenPayment?.amount || 0n)
        ) {
          const approveHash = await approveToken({
            token: uiConfig.wMatic,
            spender: uiConfig.decentOpenActionContractAddress,
            amount: resp.actionResponse?.tokenPayment?.amount || 0n,
          });
          console.log('approved!', approveHash);
          if (!approveHash) {
            console.log('not approved!');
            return;
          }
          const approveResult = await publicClient({
            chainId: currChainId,
          }).waitForTransactionReceipt({ hash: approveHash });
          console.log('approved!', approveResult);
        }
      }
      console.log('here!', walletClient);
      const hash = await walletClient!.sendTransaction({
        to: uiConfig.lensHubProxyAddress,
        account: address,
        data: calldata as `0x${string}`,
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

  const executeCollect = async (post: PostCreatedEventFormatted) => {
    const baseFeeCollectModuleTypes = [
      { type: 'address' },
      { type: 'uint256' },
    ];

    const encodedBaseFeeCollectModuleInitData = encodeAbiParameters(
      baseFeeCollectModuleTypes,
      [zeroAddress, 0]
    );

    const encodedCollectActionData = encodeAbiParameters(
      [{ type: 'address' }, { type: 'bytes' }],
      [address!, encodedBaseFeeCollectModuleInitData]
    );

    const args = {
      publicationActedProfileId: BigInt(post.args.postParams.profileId || 0),
      publicationActedId: BigInt(post.args.pubId),
      actorProfileId: BigInt(profileId || 0),
      referrerProfileIds: [],
      referrerPubIds: [],
      actionModuleAddress: uiConfig.collectActionContractAddress,
      actionModuleData: encodedCollectActionData as `0x${string}`,
    };

    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: 'act',
      args: [args],
    });

    setCreateState('PENDING IN WALLET');
    try {
      const hash = await walletClient!.sendTransaction({
        to: uiConfig.lensHubProxyAddress,
        account: address,
        data: calldata as `0x${string}`,
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
    <div className="flex flex-col border rounded-xl px-5 py-3 mb-3 justify-center">
      <div className="flex flex-col justify-center items-center">
        <p>ProfileID: {post.args.postParams.profileId}</p>
        <p>PublicationID: {post.args.pubId}</p>
        <img
          className="my-3 rounded-2xl"
          src={serializeLink(post.args.postParams.contentURI)}
          alt="Post"
        />
        <Button asChild variant="link">
          <a
            href={`${uiConfig.blockExplorerLink}${post.transactionHash}`}
            target="_blank"
          >
            Txn Link
          </a>
        </Button>
      </div>
      <div>
        <p className="mb-2">Open action details</p>
        <p>{`Address: ${contract}`}</p>
        <p>{`Chain: ${dstChain}`}</p>
        <p>{`Cost ${formatUnits(cost, 18)}`}</p>
      </div>
      {profileId && (
        <Button
          className="mt-3"
          onClick={() => executeDecentOA(post)}
          disabled={resp.isLoading}
        >
          Mint
        </Button>
      )}
      {profileId &&
        post.args.postParams.actionModules.includes(
          uiConfig.collectActionContractAddress
        ) && (
          <Button className="mt-3" onClick={() => executeCollect(post)}>
            Collect Post
          </Button>
        )}
      {createState && (
        <p className="mt-2 text-primary create-state-text">{createState}</p>
      )}
      {txHash && (
        <a
          href={`${uiConfig.blockExplorerLink}${txHash}`}
          target="_blank"
          className="block-explorer-link"
        >
          Block Explorer Link
        </a>
      )}
    </div>
  );
};

export const Actions = () => {
  const [filterOwnPosts, setFilterOwnPosts] = useState(false);
  const { address, profileId, posts, refresh, loading } = useDecentOA();
  const activePosts = mode === 'api' ? [] : posts;
  let filteredPosts = activePosts;
  console.log('filtered posts', posts);
  filterOwnPosts
    ? activePosts.filter(
        (post) => post.args.postParams.profileId === profileId?.toString()
      )
    : activePosts;

  filteredPosts = filteredPosts.sort((a, b) => {
    const blockNumberA = parseInt(a.blockNumber, 10);
    const blockNumberB = parseInt(b.blockNumber, 10);
    return blockNumberB - blockNumberA;
  });

  return (
    <>
      {address && profileId && (
        <div className="my-3">
          <input
            type="checkbox"
            id="filterCheckbox"
            className="mr-3"
            checked={filterOwnPosts}
            onChange={(e) => setFilterOwnPosts(e.target.checked)}
          />
          <label htmlFor="filterCheckbox">
            Filter only posts from my profile
          </label>
        </div>
      )}
      {loading && <div className="spinner" />}
      {filteredPosts.length === 0 ? (
        <p>None</p>
      ) : (
        filteredPosts
          .filter((post) => !!fetchParams(post))
          .map((post, index) => (
            <ActionBox
              key={index}
              post={post}
              address={address}
              profileId={profileId}
              refresh={refresh}
            />
          ))
      )}
    </>
  );
};
