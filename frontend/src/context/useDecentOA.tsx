import { ReactNode, FC, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  PostCreatedEvent,
  PostCreatedEventFormatted,
  convertPostEventToSerializable,
  LoginData,
  InitializedPublicationAction,
  InitializedPublicationActionFormatted,
  convertDecentInitEventToSerializable,
} from '../utils/types';
import { currChainId, network, uiConfig } from '../utils/constants';
import { publicClient } from '../main';
import { lensHubEventsAbi } from '../utils/lensHubEventsAbi';
import { decentAbi } from '@/utils/decentAbi';
import { disconnect } from 'wagmi/actions';
import DecentOAContext from './DecentOAContext';
import { ChainId } from '@decent.xyz/box-common';

interface DecentOAProviderProps {
  children: ReactNode;
}

export const DecentOAProvider: FC<DecentOAProviderProps> = ({ children }) => {
  const [handle, setHandle] = useState<string | undefined>();
  const [profileId, setProfileId] = useState<number | undefined>();
  const { address } = useAccount();
  const [posts, setPosts] = useState<PostCreatedEventFormatted[]>([]);
  const [decentActions, setDecentActions] = useState<
    InitializedPublicationActionFormatted[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>();

  const connect = (loginDataParam: LoginData) => {
    setLoginData(loginDataParam);
  };

  const chainId = network === 'polygon' ? 137 : 80001;

  const refresh = useCallback(async () => {
    setLoading(true);

    // const savedCurrentBlock = localStorage.getItem('currentBlock');
    const savedPostEvents: PostCreatedEventFormatted[] = JSON.parse(
      localStorage.getItem('postEvents') || '[]'
    );
    const savedDecentEvents: InitializedPublicationActionFormatted[] =
      JSON.parse(localStorage.getItem('decentEvents') || '[]');

    if (savedPostEvents.length) {
      setPosts(savedPostEvents);
    }

    if (savedDecentEvents) {
      setDecentActions(savedDecentEvents);
    }

    const startBlock = uiConfig.decentStartBlock;

    const currentBlock = await publicClient({
      chainId,
    }).getBlockNumber();

    const postEventsMap = new Map(
      savedPostEvents.map((event) => [event.transactionHash, event])
    );
    const decentInitEventsMap = new Map(
      savedDecentEvents.map((event) => [event.transactionHash, event])
    );

    for (let i = startBlock; i < currentBlock; i += 2000) {
      const toBlock = i + 1999 > currentBlock ? currentBlock : i + 1999;
      // console.log('startblock', startBlock);
      const postEvents = await publicClient({
        chainId: currChainId,
      }).getContractEvents({
        address: uiConfig.lensHubProxyAddress,
        abi: lensHubEventsAbi,
        eventName: 'PostCreated',
        fromBlock: BigInt(i),
        toBlock: BigInt(toBlock),
      });

      const decentInitEvents = await publicClient({
        chainId,
      }).getContractEvents({
        address: uiConfig.decentOpenActionContractAddress,
        abi: decentAbi,
        fromBlock: BigInt(i),
        eventName: 'InitializedPublicationAction',
        toBlock: BigInt(toBlock),
      });

      const postEventsParsed = postEvents as unknown as PostCreatedEvent[];
      const decentInitEventsParsed =
        decentInitEvents as unknown as InitializedPublicationAction[];

      const filteredEvents = postEventsParsed.filter((event) => {
        return event.args.postParams.actionModules.includes(
          uiConfig.decentOpenActionContractAddress
        );
      });

      const serializablePostEvents = filteredEvents.map((event) =>
        convertPostEventToSerializable(event)
      );

      const serializableInitEvents = decentInitEventsParsed.map((event) =>
        convertDecentInitEventToSerializable(event)
      );

      serializablePostEvents.forEach((event) =>
        postEventsMap.set(event.transactionHash, event)
      );
      serializableInitEvents.forEach((event) =>
        decentInitEventsMap.set(event.transactionHash, event)
      );
    }

    const allPostEvents = Array.from(postEventsMap.values()).filter(
      (x) => x.args.pubId != '8' && x.args.pubId != '6'
    );
    const allDecentInitEvents = Array.from(decentInitEventsMap.values());
    console.log(allDecentInitEvents);
    console.log('post events', allPostEvents);
    console.log('decent init events', allDecentInitEvents);

    localStorage.setItem('currentBlock', currentBlock.toString());
    localStorage.setItem('postEvents', JSON.stringify(allPostEvents));
    localStorage.setItem('decentEvents', JSON.stringify(allDecentInitEvents));

    setPosts(allPostEvents);
    setDecentActions(allDecentInitEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (loginData) {
      setHandle(loginData!.handle!.localName);
      setProfileId(parseInt(loginData!.id, 16));

      localStorage.setItem('handle', loginData!.handle!.localName);
      localStorage.setItem('profileId', loginData!.id);
      localStorage.setItem('address', loginData.ownedBy.address);
    }
  }, [loginData]);

  // Set handle and profile
  useEffect(() => {
    const storedHandle = localStorage.getItem('handle');
    const storedProfileId = localStorage.getItem('profileId');
    const storedAddress = localStorage.getItem('address');

    if (storedHandle && address === storedAddress) {
      setHandle(storedHandle);
    } else {
      setHandle(undefined);
    }

    if (storedProfileId && address === storedAddress) {
      setProfileId(parseInt(storedProfileId, 16));
    } else {
      setProfileId(undefined);
    }
  }, [address]);

  return (
    <DecentOAContext.Provider
      value={{
        profileId,
        handle,
        address,
        posts,
        initEvents: decentActions,
        refresh,
        clear: () => {
          setProfileId(undefined);
          setHandle(undefined);
        },
        disconnect: () => {
          disconnect();
          localStorage.removeItem('handle');
          localStorage.removeItem('profileId');
          localStorage.removeItem('address');
        },
        loading,
        connect,
      }}
    >
      {children}
    </DecentOAContext.Provider>
  );
};
