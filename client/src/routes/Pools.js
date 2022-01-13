import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Center, CircularProgress, CircularProgressLabel, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem,
  Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Link, Progress, SimpleGrid, Spacer, Stack, Stat, StatLabel, StatNumber, Skeleton,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text, } from "@chakra-ui/react";
import { CalendarIcon, CopyIcon, ExternalLinkIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { ChainID, ChainType, hexToNumber, numberToHex, fromWei, Units, Unit } from "@harmony-js/utils";
import { useTrackedState, useSetState } from "store";
import { useLocation, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommentsCard from "components/pools/view/CommentsCard";
import ProposalsCard from "components/pools/view/ProposalsCard";
import ContributeModal from "components/pools/contribute/ContributeModal";
import CreateProposalModal from "components/pools/proposals/CreateProposalModal";
import CommentsSchema from "validations/schemas/CommentsSchema";
import yup from "validations/validations";
import * as Constants from "constants/Constants";
import * as Utils from "utils/Utils";
import moment from "moment";
import PoolFactoryABI from "abi/PoolFactory";
import PoolsABI from "abi/Pools";

const MyPools = (props) => {
  return (
    <Center h="90%">
      <Stack>
        <Center>WIP</Center>
        <Center>This would be where your pools and any trending/popular pools would be listed.</Center>
      </Stack>
    </Center>
  );
};

export default MyPools;
