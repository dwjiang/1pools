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
import PoolFactoryABI from "abi/PoolFactory";
import PoolsABI from "abi/Pools";

const MyPools = (props) => {
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  
  useEffect(() => {
    
  }, []);
  
  useEffect(() => {
    (async () => {
      // let pools = [];
      // const client = state.harmony.client;
      // const factoryContract = await client.contracts.createContract(PoolFactoryABI, Constants.POOLS_FACTORY_ADDRESS);
      // console.log(factoryContract.methods);
      // console.log(await factoryContract.methods.getInstantiations().call());
      // (await factoryContract.methods.getInstantiations().call()).forEach(async (address) => {
      //   const contract = await client.contracts.createContract(PoolsABI, Constants.POOLS_FACTORY_ADDRESS);
      // 
      // });
      
      
    })();
  }, [state.walletAddress]);

  return (
    <Stack>
      <Accordion>
        <AccordionItem>
          <AccordionButton>
            <Text>My Pools</Text>
            <Spacer/>
            <AccordionIcon/ >
          </AccordionButton>
          <AccordionPanel>
            <Flex>
              {
                
              }
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};

export default MyPools;
