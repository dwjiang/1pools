import React, { useState, useEffect } from "react";
import { Box, Button, Flex, FormLabel, HStack, Link, Spacer, Switch, Text, VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTrackedState, useSetState } from "store";
import styles from "components/header/Header.module.css"; 
import * as Utils from "utils/Utils"; 

const Header = () => {
  const context = useWeb3React();
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  
  useEffect(() => {
    const walletAddress = window.sessionStorage.getItem("authenticated");
    if (walletAddress) {
      context.activate(state.walletConnector);
      dispatch({ walletAddress });
    }
  }, []);
  
  useEffect(() => {
    if (context.account && context.active && context.connector && context.library) {
      const walletAddress = context.connector.bech32Address
      dispatch({
        web3Context: context, 
        walletAddress,
      });
      if (!window.sessionStorage.getItem("authenticated")) {
        toast({
          title: "Wallet successfully connected",
          status: "success",
          isClosable: true,
          position: "bottom-right",
        });
      }
      window.sessionStorage.setItem("authenticated", walletAddress);
    }
  }, [context.account, context.active, context.context, context.library]);
  
  const connectWallet = async () => {
    try {
      if (!window.onewallet || !window.onewallet.isOneWallet) {
        toast({
          title: "Harmony Chrome Extension Wallet not installed",
          status: "error",
          isClosable: true,
          position: "bottom-right",
        });
        return;
      }
      await context.activate(state.walletConnector);
    } catch (error) {
      toast({
        title: "Error connecting wallet",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }

  const disconnectWallet = async () => {
    try {
      await context.deactivate();
      if (context.connector && context.connector.close)
        context.connector.close();
      window.sessionStorage.removeItem("authenticated");
      dispatch({
        web3Context: null,
        walletAddress: null,
      });
      toast({
        title: "Wallet successfully disconnected",
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error disconnecting wallet",
        description: "Try refreshing the page.",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
  const copyWalletToClipboard = async () => {
    try {
      if (!state.walletAddress)
        throw new Error();
      await Utils.copyToClipboard(state.walletAddress);
      toast({
        title: "Wallet address copied to clipboard",
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error copying wallet address to clipboard",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
      
  return (
    <VStack spacing="0em" marginBottom="1rem">
      <Flex className={styles.header}>
        <HStack spacing="1rem">
          <Link href="/" fontSize="5xl" 
            className={styles["header-logo"]}>🏊</Link>
          <Link href="/" fontSize="2xl"
            className={styles["header-logo"]}><strong>1Pools</strong></Link>
          <Link href="/pools" className={styles["header-link"]}>
            <Text as="u"><strong>My Pools</strong></Text>
          </Link>
          <Link href="/create-pool" className={styles["header-link"]}>
            <Text as="u"><strong>Create Pool</strong></Text>
          </Link>
        </HStack>
        <Spacer/>
        <HStack spacing="1rem" className={styles["header-right"]}>
          { !state.walletAddress ?
            <Button onClick={connectWallet}>
              Connect Wallet
            </Button> :
            <HStack spacing="1rem">
              <Button onClick={copyWalletToClipboard}>
                { Utils.shortenWalletAddress(state.walletAddress) }
              </Button>
              <Button onClick={disconnectWallet}>
                Disconnect Wallet
              </Button>
            </HStack>
          }
        </HStack>
      </Flex>
    </VStack>
  );
};

export default Header;
