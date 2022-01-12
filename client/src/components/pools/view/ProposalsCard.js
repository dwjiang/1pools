import React, { useState, useEffect, useRef } from "react";
import { Badge, Heading, HStack, IconButton, Spacer, Stack, Text } from "@chakra-ui/react";
import { ChevronRightIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import ViewProposalModal from "components/pools/proposals/ViewProposalModal";
import * as Utils from "utils/Utils";
import moment from "moment";

const ProposalsCard = ({ item, index, ownersForProposal }) => {
  let [ isViewModalOpen, setIsViewModalOpen ] = useState(false);
  
  return (
    <HStack>
      <ViewProposalModal item={item} index={index} ownersForProposal={ownersForProposal} 
        isOpen={isViewModalOpen} onClose={()=>setIsViewModalOpen(false)}/>
      <Stack w="100%">
        <HStack>
          <Heading size="xs">{`Proposal #${index}`}</Heading>
          { item.executed && <Badge>Executed</Badge> }
          <Text fontSize="xs" opacity={0.8}>
            Proposed by {Utils.shortenWalletAddress(item.proposedBy)} on {item.createdAt}
          </Text>
        </HStack>
        <Stack>
          <Text fontSize="sm" opacity={0.8}>Send {item.amount} $ONE to {Utils.shortenWalletAddress(item.destination)}.</Text>
          <Text fontSize="sm" opacity={0.8} noOfLines={2}>{item.data}</Text>
        </Stack>
        <HStack>
          <Text fontSize="xs">Votes:</Text>
          <Badge colorScheme="green">Yes</Badge>
          <Text fontSize="xs">{item.numConfirmations[1]} / {ownersForProposal} votes</Text>
          <Badge colorScheme="red">No</Badge>
          <Text fontSize="xs">{item.numConfirmations[2]} votes</Text>
          <Badge>Undecided</Badge>
          <Text fontSize="xs">{item.numConfirmations[0]} votes</Text>
          <Badge>Abstain</Badge>
          <Text fontSize="xs">{item.numConfirmations[3]} votes</Text>
        </HStack>
      </Stack>
      <Spacer/>
      <IconButton size="lg" icon={<ChevronRightIcon/>} onClick={()=>setIsViewModalOpen(true)}/>
    </HStack>
  );
}

export default ProposalsCard;
