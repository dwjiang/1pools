import React, { useState } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton,
  Button, Flex, Link, Modal, ModalOverlay, ModalContent, ModalHeader, Text,
  ModalFooter, ModalBody, ModalCloseButton, useToast, FormLabel, HStack, Stack, 
  Input, InputGroup, FormControl, FormErrorMessage, FormHelperText, InputRightAddon
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ChainID, ChainType, hexToNumber, numberToHex, fromWei, Units, Unit } from "@harmony-js/utils";
import { useTrackedState, useSetState } from "store";
import ContributionSchema from "validations/schemas/ContributionSchema";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "validations/validations";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import * as Constants from "constants/Constants"; 

const ContributeModal = ({ id, isOpen, onClose }) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  
  const form = useForm({
    mode: "onBlur", 
    resolver: yupResolver(ContributionSchema),
  });
  const { register, getValues, reset, formState: { errors } } = form;
  
  const onSubmit = async () => {
    try {
      const hmy = state.harmony.client;
      const txn = hmy.transactions.newTx({
        from: state.walletAddress,
        to: id,
        value: new BN(new BigNumber(getValues("contribution")).multipliedBy(Math.pow(10, 18)).toFixed(), 10),
        gasLimit: "25000",
        gasPrice: new hmy.utils.Unit("1").asGwei().toWei(),
        shardId: 0,
        toShardID: 0,
      });
      const signedTxn = await state.walletConnector.signTransaction(txn);
      const txnHash = await hmy.blockchain.sendRawTransaction(signedTxn);
      const link = `${Constants.EXPLORER_POP_URL_BASE}/${txnHash}`;
      toast({
        title: "Operation injected",
        description: (
          <Link isExternal href={link}>
            <Text as="u">Click here to view your transaction.</Text>
            <ExternalLinkIcon size="xs"/>
          </Link>
        ),
        status: "success",
        isClosable: true,
        position: "bottom-right",
        duration: null,
      });
      reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error submitting transaction",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent maxW="48rem">
        <ModalHeader>Contribute to Pool</ModalHeader>
        <ModalCloseButton/>
        <ModalBody p="2rem">
          <Stack flexDir="column" spacing="2rem">
            <Alert status="info" borderRadius="0.5rem">
              <AlertIcon />
              <AlertDescription>Remember to check your url and make sure you are contributing to the correct pool.</AlertDescription>
            </Alert>
            <FormControl isRequired isInvalid={errors?.contribution?.message} errortext={errors?.contribution?.message}>
              <FormLabel>Contribution Amount ($ONE)</FormLabel>
              <InputGroup>
                <Input { ...register("contribution") } placeholder="Required (Maximum 15 Characters)"/>
                <InputRightAddon children="$ONE"/>
              </InputGroup>
              <FormErrorMessage>{errors?.contribution?.message}</FormErrorMessage>
            </FormControl>
            <Flex width="100%" justify="flex-end">
              <Button size="sm" variant="ghost" onClick={form.handleSubmit(onSubmit)}>
                Submit
              </Button>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContributeModal;
