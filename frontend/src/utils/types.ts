export type PostCreatedEvent = {
  args: {
    postParams: {
      profileId: number;
      contentURI: string;
      actionModules: string[];
      actionModulesInitDatas: string[];
      referenceModule: string;
      referenceModuleInitData: string;
    };
    pubId: number;
    actionModulesInitReturnDatas: string[];
    referenceModuleInitReturnData: string;
    transactionExecutor: string;
    timestamp: number;
  };
  blockNumber: number;
  transactionHash: string;
};

export type PostCreatedEventFormatted = {
  args: {
    postParams: {
      profileId: string;
      contentURI: string;
      actionModules: string[];
      actionModulesInitDatas: string[];
      referenceModule: string;
      referenceModuleInitData: string;
    };
    pubId: string;
    actionModulesInitReturnDatas: string[];
    referenceModuleInitReturnData: string;
    transactionExecutor: string;
    timestamp: string;
  };
  blockNumber: string;
  transactionHash: string;
};

export type GreetEvent = {
  args: {
    message: string;
    actor: string;
  };
  blockNumber: number;
  transactionHash: string;
};

export type GreetEventFormatted = {
  args: {
    message: string;
    actor: string;
  };
  blockNumber: string;
  transactionHash: string;
};

export type InitializedPublicationAction = {
  args: {
    profileId: string; // uint256
    pubId: string; // uint256
    transactionExecutor: string; // address
  };
  blockNumber: number;
  transactionHash: string;
};

export type InitializedPublicationActionFormatted = {
  args: {
    profileId: string;
    pubId: string;
    transactionExecutor: string;
  };
  blockNumber: string;
  transactionHash: string;
};

export function convertPostEventToSerializable(
  event: PostCreatedEvent
): PostCreatedEventFormatted {
  return {
    ...event,
    args: {
      ...event.args,
      postParams: {
        ...event.args.postParams,
        profileId: event.args.postParams.profileId.toString(),
      },
      pubId: event.args.pubId.toString(),
      timestamp: event.args.timestamp.toString(),
    },
    blockNumber: event.blockNumber.toString(),
  };
}

export function convertGreetEventToSerializable(
  event: GreetEvent
): GreetEventFormatted {
  return {
    ...event,
    blockNumber: event.blockNumber.toString(),
  };
}

export function convertDecentInitEventToSerializable(
  event: InitializedPublicationAction
): InitializedPublicationActionFormatted {
  return {
    ...event,
    args: {
      profileId: event.args.profileId.toString(),
      pubId: event.args.pubId.toString(),
      transactionExecutor: event.args.transactionExecutor,
    },
    blockNumber: event.blockNumber.toString(),
  };
}

export const bigintSerializer = (key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return value.toString() + 'n';
  }

  return value;
};

export type LoginData = {
  handle: {
    localName: string;
  };
  id: string;
  ownedBy: {
    address: string;
  };
};
