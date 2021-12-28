import React, { useState } from "react";
import { createContainer } from "react-tracked";
import { Hmy } from "@harmony-utils/wrappers";
import { OneWalletConnector } from "@harmony-react/onewallet-connector";

const harmony = new Hmy("testnet");

const initialGlobalState = {
  walletAddress: null,
  web3Context: null,
  walletConnector: new OneWalletConnector({ chainId: harmony.client.chainId }),
  harmony,
};

const useValue = () => (
  React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    initialGlobalState,
  )
);

export const {
  Provider,
  useTrackedState,
  useUpdate: useSetState,
} = createContainer(useValue);
