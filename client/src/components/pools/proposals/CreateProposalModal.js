import React, { useState } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton,
  Button, Flex, Link, Modal, ModalOverlay, ModalContent, ModalHeader, Text,
  ModalFooter, ModalBody, ModalCloseButton, useToast, FormLabel, HStack, Stack, 
  Input, InputGroup, FormControl, FormErrorMessage, FormHelperText, InputRightAddon,
  Textarea, 
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ChainID, ChainType, hexToNumber, numberToHex, fromWei, Units, Unit } from "@harmony-js/utils";
import { useTrackedState, useSetState } from "store";
import CreateProposalSchema from "validations/schemas/CreateProposalSchema";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "validations/validations";
import BigNumber from "bignumber.js";
import BN from "bn.js";
import * as Constants from "constants/Constants"; 

const CreateProposalModal = ({ id, ownersForProposal, numOwners, isOpen, onClose, onSubmit }) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  
  const form = useForm({
    mode: "onBlur", 
    resolver: yupResolver(CreateProposalSchema),
  });
  const { register, getValues, reset, formState: { errors } } = form;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent maxW="48rem">
        <ModalHeader>Create Proposal</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Stack flexDir="column" spacing="1rem" mb="1rem">
            <Text>{`A proposal would require ${ownersForProposal} out of ${numOwners} votes for the amount to be delegated to the specified wallet address.`}</Text>
            <FormControl isRequired isInvalid={errors?.address?.message} errortext={errors?.address?.message}>
              <FormLabel>Destination Address</FormLabel>
              <Input placeholder="Required" { ...register("address") }/>
              <FormErrorMessage>{errors?.address?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors?.amount?.message} errortext={errors?.amount?.message}>
              <FormLabel>Amount to Delegate ($ONE)</FormLabel>
              <InputGroup>
                <Input { ...register("amount") } placeholder="Required (Maximum 15 Characters)"/>
                <InputRightAddon children="$ONE"/>
              </InputGroup>
              <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
              <FormHelperText>This amount the pool would be sending to the specified destination address if the proposal is passed.</FormHelperText>
            </FormControl>
            <FormControl isInvalid={errors?.message?.message} errortext={errors?.message?.message}>
              <FormLabel>Proposal Justification/Description</FormLabel>
              <Textarea { ...register("message") } placeholder="Optional"/>
              <FormErrorMessage>{errors?.message?.message}</FormErrorMessage>
              <FormHelperText>Write the justification/description for this proposal.</FormHelperText>
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

export default CreateProposalModal;
