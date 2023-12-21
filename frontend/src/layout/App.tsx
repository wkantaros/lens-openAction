import { Home } from './Home.tsx';
import { LensConfig, development, production } from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { LensProvider } from '@lens-protocol/react-web';
import { WalletConnectProvider } from './WalletConnectProvider.tsx';
import { Button } from '@/components/ui/button';
import { network } from '@/utils/constants.tsx';
import { DecentOAProvider } from '@/context/useDecentOA.tsx';
import { useDecentOA } from '@/context/DecentOAContext.ts';
import { BoxHooksContextProvider } from '@decent.xyz/box-hooks';

const decentApiKey = import.meta.env.VITE_DECENT_API_KEY;

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: network === 'polygon' ? production : development,
};

export const App = () => {
  return (
    <WalletConnectProvider>
      <BoxHooksContextProvider apiKey={decentApiKey}>
        <LensProvider config={lensConfig}>
          <DecentOAProvider>
            <Nav />
            <Home />
          </DecentOAProvider>
        </LensProvider>
      </BoxHooksContextProvider>
    </WalletConnectProvider>
  );
};

function Nav() {
  const { handle, clear, disconnect } = useDecentOA();

  return (
    <nav className="flex flex-1 border-b">
      <div className="px-4 py-3 flex-1">
        <p className="text-sm">Lens Smart Post Starter</p>
      </div>
      {handle && (
        <>
          <Button
            variant="link"
            className="py-1 mr-3"
            onClick={() => {
              clear();
              disconnect();
            }}
          >
            Disconnect
          </Button>
        </>
      )}
    </nav>
  );
}

export default App;
