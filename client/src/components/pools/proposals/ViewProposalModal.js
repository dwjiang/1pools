import React, { useState } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, Badge, Center, CloseButton,
  Button, Flex, Link, Modal, ModalOverlay, ModalContent, ModalHeader, Text,
  ModalFooter, ModalBody, ModalCloseButton, useToast, FormLabel, HStack, Stack, 
  Input, InputGroup, FormControl, FormErrorMessage, FormHelperText, InputRightAddon,
  Textarea, IconButton, Box
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, MinusIcon, ArrowForwardIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useTrackedState, useSetState } from "store";
import CreateProposalSchema from "validations/schemas/CreateProposalSchema";
import * as Constants from "constants/Constants";
import * as Utils from "utils/Utils";
import PoolsABI from "abi/Pools";

const ViewProposalModal = ({ id, item, index, ownersForProposal, isOpen, onClose, onUpdate }) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  let [ loading, setLoading ] = useState(false);
  
  const copyToClipboard = async (text) => {
    try {
      await Utils.copyToClipboard(text);
      toast({
        title: "Copied to clipboard",
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Error copying to clipboard",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
  const onVote = async (vote) => {
    try {
      setLoading(true);
      const contract = await state.harmony.client.contracts.createContract(PoolsABI, id);
      const attachedContract = await state.walletConnector.attachToContract(contract);
      const result = await attachedContract.methods.setConfirmation(index - 1, vote).send({
        from: state.walletConnector.address
      }).on("receipt", async (receipt) => {
        console.log(receipt);
        const link = `${Constants.EXPLORER_POP_URL_BASE}/${receipt.transactionHash}`;
        toast({
          title: "Successfully submitted your vote.",
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
        onUpdate();
        onClose();
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error submitting vote.",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent maxW="48rem">
        <ModalHeader>
          <Text>Proposal #{index} 🗳️</Text>
          <Text fontSize="sm" opacity="0.8" fontWeight="1">Proposed by {item.proposedBy}</Text>
          <Text fontSize="sm" opacity="0.8" fontWeight="1">Proposed on {item.createdAt}</Text>
        </ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Stack flexDir="column" mb="2rem">
            <Center>
              <HStack>
                <Text>{item.amount} $ONE</Text>
                <ArrowForwardIcon/>
                <Text>{Utils.shortenWalletAddress(item.destination)}</Text>
                <IconButton size="xs" icon={<CopyIcon/>}
                  onClick={()=>copyToClipboard(item.destination)}/>
              </HStack>
            </Center>
            <Stack spacing="0.5rem">
              <Text><strong>Description/Justification</strong></Text>
              <Text pb="1rem">{item.data}</Text>
            </Stack>
            <Center>
              <HStack spacing="1rem">
                <Button variant="outline" leftIcon={"👍"} onClick={()=>onVote(1)}>
                  <Text fontSize="md">{item.numConfirmations[1]} / {ownersForProposal} votes</Text>
                </Button>
                <Button variant="outline" leftIcon={"👎"} onClick={()=>onVote(2)}>
                  <Text fontSize="md">{item.numConfirmations[2]} votes</Text>
                </Button>
                <Button variant="outline" leftIcon={"❓"} onClick={()=>onVote(0)}>
                  <Text fontSize="md">{item.numConfirmations[0]} votes</Text>
                </Button>
              </HStack>
            </Center>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ViewProposalModal;
