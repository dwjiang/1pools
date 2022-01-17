import React, { useState, useEffect, useRef } from "react";
import { Box, Badge, Button, Heading, HStack, IconButton, Link, Spacer, Stack, Text, useToast } from "@chakra-ui/react";
import { ChevronRightIcon, InfoOutlineIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import ViewProposalModal from "components/pools/proposals/ViewProposalModal";
import { useTrackedState, useSetState } from "store";
import * as Utils from "utils/Utils";
import * as Constants from "constants/Constants";
import moment from "moment";
import PoolsABI from "abi/Pools";

const ProposalsCard = ({ id, item, index, ownersForProposal, onUpdate, endsAt }) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  let [ isViewModalOpen, setIsViewModalOpen ] = useState(false);
  let [ loading, setLoading ] = useState(false);
  
  const diff = moment(endsAt).diff(moment(), "seconds");

  const execute = async () => {
    try {
      setLoading(true);
      const contract = await state.harmony.client.contracts.createContract(PoolsABI, id);      
      const attachedContract = await state.walletConnector.attachToContract(contract);
      const result = await attachedContract.methods.executeProposal(index).send({
        gasPrice: state.harmony.gasPrice * 30,
        gasLimit: state.harmony.gasLimit,
        from: state.walletConnector.address
      }).on("receipt", async (receipt) => {
        console.log(receipt);
        const link = `${Constants.EXPLORER_POP_URL_BASE}/${receipt.transactionHash}`;
        onUpdate();
        toast({
          title: "Successfully executed proposal.",
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
      });
    } catch (error) {
      toast({
        title: "Error executing proposal.",
        description: "Make sure there is enough balance in your pool first",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <HStack>
      <ViewProposalModal id={id} item={item} index={index} ownersForProposal={ownersForProposal} 
        isOpen={isViewModalOpen} onClose={()=>setIsViewModalOpen(false)} onUpdate={onUpdate}/>
      <Stack w="100%">
        <HStack>
          <Heading size="xs" onClick={()=>setIsViewModalOpen(true)}><Link>{`Proposal #${index}`}</Link></Heading>
          { item.executed && <Badge>Executed</Badge> }
          <Text fontSize="xs" opacity={0.8}>
            Proposed by {Utils.shortenWalletAddress(item.proposedBy)} on {item.createdAt}
          </Text>
          <Spacer/>
          <Button size="sm" onClick={()=>setIsViewModalOpen(true)}>View</Button>
          <Button size="sm" isDisabled={diff > 0 || item.executed || item.numConfirmations[1] < ownersForProposal}
            onClick={execute}>Execute</Button>
        </HStack>
        <Stack>
          <Text fontSize="sm" opacity={0.8}>Send {item.amount} $ONE to {Utils.shortenWalletAddress(item.destination)}.</Text>
          <Text fontSize="sm" opacity={0.8} noOfLines={2}>{item.data}</Text>
        </Stack>
        <HStack>
          <Text fontSize="xs">Votes:</Text>
          <Box p="0.5rem" border="1px" borderColor="gray.200" borderRadius="0.5rem">
            <Text fontSize="xs">👍&nbsp;&nbsp;&nbsp;{item.numConfirmations[1]} / {ownersForProposal} votes</Text>
          </Box>
          <Box p="0.5rem" border="1px" borderColor="gray.200" borderRadius="0.5rem">
            <Text fontSize="xs">👎&nbsp;&nbsp;&nbsp;{item.numConfirmations[2]} / {ownersForProposal} votes</Text>
          </Box>
          <Box p="0.5rem" border="1px" borderColor="gray.200" borderRadius="0.5rem">
            <Text fontSize="xs">❓&nbsp;&nbsp;&nbsp;{item.numConfirmations[0]} / {ownersForProposal} votes</Text>
          </Box>
        </HStack>
      </Stack>
    </HStack>
  );
}

export default ProposalsCard;
