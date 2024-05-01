import type { AppProps } from "next/app";
import { ThirdwebProvider, coinbaseWallet, embeddedWallet, metamaskWallet,smartWallet } from "@thirdweb-dev/react";
import "../styles/globals.css";
const SMARTWALLET_ADDRESS = process.env.SMARTWALLET_ADDRESS
// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "binance-testnet";

const smartWalletConfig = {
  factoryAddress: SMARTWALLET_ADDRESS,
  gasless: true,
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={activeChain}
      supportedWallets={[
        smartWallet(embeddedWallet(), smartWalletConfig),
        metamaskWallet(),
        coinbaseWallet(),
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
