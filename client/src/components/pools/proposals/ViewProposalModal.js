import React, { useState } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, Badge, Center, CloseButton,
  Button, Flex, Link, Modal, ModalOverlay, ModalContent, ModalHeader, Text,
  ModalFooter, ModalBody, ModalCloseButton, useToast, FormLabel, HStack, Stack, 
  Input, InputGroup, FormControl, FormErrorMessage, FormHelperText, InputRightAddon,
  Textarea, IconButton, Box
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
import { useTrackedState, useSetState } from "store";
import CreateProposalSchema from "validations/schemas/CreateProposalSchema";
import * as Constants from "constants/Constants";

const ViewProposalModal = ({ item, index, ownersForProposal, isOpen, onClose }) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent maxW="48rem">
        <ModalHeader>Proposal #{index}</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Stack flexDir="column" spacing="2rem" mb="2rem">
            <Text><strong>Proposed by </strong>{item.proposedBy}</Text>
            <Text><strong>Destination address </strong>{item.destination}</Text>
            <Text><strong>Amount to send </strong>{item.amount} $ONE</Text>
            <Stack spacing="0.5rem">
              <Text><strong>Description/Justification</strong></Text>
              <Text>{item.data}</Text>
            </Stack>
            <Center>
              <HStack spacing="1rem">
                <Button variant="solid">
                  <Badge fontSize="md" colorScheme="green" mr="0.5rem">Yes</Badge>
                  <Text fontSize="md">{item.numConfirmations[1]} / {ownersForProposal} votes</Text>
                </Button>
                <Button variant="outline">
                  <Badge fontSize="md" colorScheme="red" mr="0.5rem">No</Badge>
                  <Text fontSize="md">{item.numConfirmations[2]} votes</Text>
                </Button>
                <Button variant="outline">
                  <Badge fontSize="md" mr="0.5rem">Undecided</Badge>
                  <Text fontSize="md">{item.numConfirmations[0]} votes</Text>
                </Button>
                <Button variant="outline">
                  <Badge fontSize="md" mr="0.5rem">Abstain</Badge>
                  <Text fontSize="md">{item.numConfirmations[3]} votes</Text>
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
