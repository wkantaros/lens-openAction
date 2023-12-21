// LensHelloWorldContext.tsx
import React, { useContext } from 'react';
import {
  InitializedPublicationActionFormatted,
  LoginData,
  PostCreatedEventFormatted,
} from '../utils/types';

interface DecentOAContextState {
  profileId?: number;
  handle?: string;
  address?: `0x${string}`;
  posts: PostCreatedEventFormatted[];
  initEvents: InitializedPublicationActionFormatted[];
  refresh: () => void;
  clear: () => void;
  loading: boolean;
  disconnect: () => void;
  connect: (loginData: LoginData) => void;
}

const DecentOAContext = React.createContext<DecentOAContextState>({
  clear: () => {},
  posts: [],
  refresh: () => {},
  loading: false,
  disconnect: () => {},
  connect: () => {},
  initEvents: [],
});

export const useDecentOA = (): DecentOAContextState => {
  return useContext(DecentOAContext);
};

export default DecentOAContext;
