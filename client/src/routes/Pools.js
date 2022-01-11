import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Center, CircularProgress, CircularProgressLabel, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem,
  Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Link, Progress, SimpleGrid, Spacer, Stack, Stat, StatLabel, StatNumber,
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

const MyPools = (props) => {
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];

  return (
    <Stack>
      <Accordion>
        <AccordionItem>
          <AccordionButton>
            <Text>My Pools</Text>
            <Spacer/>
            <AccordionIcon/ >
          </AccordionButton>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};

export default MyPools;
