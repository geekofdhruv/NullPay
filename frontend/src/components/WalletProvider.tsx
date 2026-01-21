import React, { FC, useMemo } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
    DecryptPermission,
    WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";

// Default styles that can be overridden by your app
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

interface AleoWalletProviderProps {
  children: React.ReactNode;
}

export const AleoWalletProvider = ({ children }: AleoWalletProviderProps) => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'AleoZKPay',
      }),
    ],
    []
  );

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.Localnet}
            autoConnect
        >
            <WalletModalProvider>
        /{children}
            </WalletModalProvider>
        </WalletProvider>
    );
};