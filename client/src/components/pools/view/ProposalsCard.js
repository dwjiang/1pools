import React, { useState, useEffect, useRef } from "react";
import { Badge, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import * as Utils from "utils/Utils";
import moment from "moment";

const ProposalsCard = ({item}) => (
  <Stack w="100%">
    <HStack>
      <Heading size="xs">{Utils.shortenWalletAddress(item.address)}</Heading>
      <Text fontSize="xs" opacity={0.8}>{moment.utc(item.createdAt).format("LLL")}</Text>
    </HStack>
    <Text fontSize="sm" opacity={0.8}>{item.content}</Text>
  </Stack>
);

export default ProposalsCard;
