import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  hexToString,
  zeroAddress,
} from 'viem';
import { useWalletClient } from 'wagmi';
import { publicClient } from '../main';
import { currChainId, mode, uiConfig } from '../utils/constants';
import { lensHubAbi } from '../utils/abis/lensHubAbi';
import { serializeLink } from '../utils/serializeLink';
import { PostCreatedEventFormatted } from '../utils/types';
import { useDecentOA } from '@/context/DecentOAContext';
import { fetchParams } from '@/utils/fetchParams';
import { ActionType } from '@decent.xyz/box-common';
import { UseBoxActionArgs, useBoxAction } from '@decent.xyz/box-hooks';
import { approveToken, getAllowance } from '@/tokenUtils';
import { signPermitSignature } from '@/utils/permit2';
import { updateWraperParams } from '@/utils/updateWrapperParams';
import { decentAbi } from '@/utils/abis/decentAbi';
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

  // we can fetch the params needed to call getActionArgs from the post itself
  const {
    targetContract: contract,
    cost,
    signature,
    chainId: dstChain,
    paymentToken: dstToken,
    platformName,
  } = fetchParams(post)!;
  const dstChainId = parseInt(dstChain.toString());

  // call this hook from @decent.xyz/box-hooks to get the actionModuleData
  const getActionArgs: UseBoxActionArgs = {
    actionType: ActionType.LensOpenAction,
    actionConfig: {
      functionCall: 'processPublicationAction',
      pubId: post.args.pubId,
      profileId: post.args.postParams.profileId,
      contractAddress: contract,
      chainId: dstChainId,
      cost: {
        isNative: true,
        amount: cost,
      },
      signature: hexToString(signature),
      args: [address, 1n],
    },
    srcChainId: currChainId,
    sender: address!,
    slippage: 3, // 1%
    srcToken: uiConfig.wMatic,
    dstToken,
    dstChainId: dstChainId,
  };

  // response w everything needed to call open action
  const resp = useBoxAction(getActionArgs);
  console.log(resp);

  const executeDecentOA = async (post: PostCreatedEventFormatted) => {
    console.log('i am here pls', resp);
    if (!resp || resp.isLoading) return;

    // get the actionModuleData from response
    const encodedActionData = resp.actionResponse!.arbitraryData.lensActionData;
    // console.log(resp);

    const amountNeeded = resp.actionResponse?.tokenPayment?.amount || 0n;
    const tokenNeeded = (resp.actionResponse?.tokenPayment?.tokenAddress ||
      zeroAddress) as `0x${string}`;

    const { signature, nonce, deadline } = await signPermitSignature(
      walletClient!,
      amountNeeded,
      tokenNeeded as `0x${string}`
    );
    const sigActionData = updateWraperParams({
      deadline: BigInt(deadline),
      nonce,
      signature,
      data: encodedActionData,
      chainId: dstChainId,
    });

    const args = {
      publicationActedProfileId: BigInt(post.args.postParams.profileId),
      publicationActedId: BigInt(post.args.pubId),
      actorProfileId: BigInt(profileId!),
      referrerProfileIds: [1n],
      referrerPubIds: [0n],
      actionModuleAddress: uiConfig.decentOpenActionContractAddress,
      actionModuleData: sigActionData as `0x${string}`,
      // actionModuleData: encodedActionData,
    };
    // swap lensHubAbi for publicActProxy address if desired and switch function to 'publicFreeAct'
    // https://polygonscan.com/address/0x53582b1b7BE71622E7386D736b6baf87749B7a2B#writeContract
    // for more information, checkout https://docs.lens.xyz/docs/deployed-contract-addresses
    const calldata = encodeFunctionData({
      abi: lensHubAbi,
      functionName: 'act',
      args: [args],
    });
    const toAddress = uiConfig.lensHubProxyAddress;

    setCreateState('PENDING IN WALLET');
    try {
      // this example of how would do approve (no permit2 sig)
      // approve token (always WMATIC for now but will be more flexible later)
      // console.log('token', tokenNeeded, amountNeeded);
      // if (tokenNeeded != zeroAddress) {
      //   const amountApproved = await getAllowance({
      //     user: address!,
      //     spender: uiConfig.decentOpenActionContractAddress,
      //     token: tokenNeeded,
      //   });
      //   console.log(amountApproved);
      //   if (amountApproved < amountNeeded) {
      //     const approveHash = await approveToken({
      //       token: tokenNeeded,
      //       spender: uiConfig.decentOpenActionContractAddress,
      //       amount: amountNeeded,
      //     });
      //     setCreateState('APPROVING TOKEN');
      //     if (!approveHash) {
      //       console.log('not approved!');
      //       setCreateState('');
      //       return;
      //     }
      //     const approveResult = await publicClient({
      //       chainId: currChainId,
      //     }).waitForTransactionReceipt({ hash: approveHash });
      //     console.log('approved!', approveResult);
      //   }
      // }
      const hash = await walletClient!.sendTransaction({
        to: toAddress,
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
        <p>Platform Name: {hexToString(platformName)}</p>
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
