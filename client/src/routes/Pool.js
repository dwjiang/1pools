import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Center, CircularProgress, CircularProgressLabel, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem,
  Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Link, Progress, SimpleGrid, Spacer, Stack, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, StatGroup, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Text, Textarea, VStack, useToast } from "@chakra-ui/react";
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
import PoolsABI from "abi/Pools";

const Pool = (props) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  let [ poolMetadata, setPoolMetadata ] = useState({});
  let [ comments, setComments ] = useState([]);
  let [ updates, setUpdates ] = useState([]);
  let [ proposals, setProposals ] = useState([]);
  let [ isContributeModalOpen, setIsContributeModalOpen ] = useState(false);
  let [ isCreateProposalModalOpen, setIsCreateProposalModalOpen ] = useState(false);

  const location = useLocation();
  const { id } = useParams();
  
  const forms = {
    updates: useForm({ mode: "onSubmit", resolver: yupResolver(CommentsSchema)}),
    comments: useForm({ mode: "onSubmit", resolver: yupResolver(CommentsSchema)}),    
  };
    
  // fetch data here (temp data for now)
  // blockchain:
  //  fetch pool metadata
  //  fetch pool transactions
  //  fetch proposals
  //  fetch pool creation date
  // server:
  //  fetch updates
  //  fetch comments
  useEffect(() => {
    fetchPoolMetadata();
    fetchProposals();
    fetchUpdates();
    fetchComments();
    // setPoolMetadata({
    //   goal: 345670,
    //   end: 5,
    //   creator: "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry",
    //   owners: [
    //     "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry",
    //     "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm",
    //     "one1klfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8lvolp",
    //     "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm",
    //     "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm",
    //     "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm",
    //     "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm",
    //     "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm",
    //   ],
    //   ownersForProposal: 2,
    // });
    // setProposals([
    //   {
    //     proposedBy: "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry",
    //     destination: "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry",
    //     amount: 12354,
    //     executed: false,
    //     data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor at risus viverra adipiscing at in tellus integer. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Odio eu feugiat pretium nibh ipsum consequat. Neque ornare aenean euismod elementum nisi.",
    //     confirmations: {
    //       one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm: 1,
    //       one1klfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8lvolp: 2,
    //     },
    //     numConfirmations: {
    //       0: 6, 1: 1, 2: 1, 3: 0
    //     }
    //   },
    //   {
    //     proposedBy: "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry",
    //     destination: "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry",
    //     amount: 12354,
    //     executed: true,
    //     data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor at risus viverra adipiscing at in tellus integer. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Odio eu feugiat pretium nibh ipsum consequat. Neque ornare aenean euismod elementum nisi.",
    //     confirmations: {
    //       one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm: 1,
    //       one1klfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8lvolp: 2,
    //     },
    //     numConfirmations: {
    //       0: 6, 1: 1, 2: 1, 3: 0
    //     }
    //   }
    // ]);
  }, []);
  
  const fetchPoolMetadata = async () => {
    let metadata = {};
    const client = state.harmony.client;
    const contract = await client.contracts.createContract(PoolsABI, id);
    const attachedContract = await state.walletConnector.attachToContract(contract);
    
    metadata.hash = await attachedContract.methods.getMetadata().call();
    metadata.owners = (await attachedContract.methods.getOwners().call()).map(address => client.crypto.toBech32(address));
    metadata.ownersForProposal = (await attachedContract.methods.getConfirmationsRequired().call())?.words?.[0];
        
    await axios.get(`${Constants.PINATA_URL_GATEWAY}/${metadata.hash}`).then(response => {
      if (response.status !== 200)
        throw new Error();
      metadata.name = response.data.name;
      metadata.description = response.data.description;
      metadata.goal = response.data.goal;
      metadata.end = response.data.end;
    }).catch(async (error) => {
      toast({
        title: "Error fetching metadata",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    });
      
    setPoolMetadata(metadata);
  }
  
  const fetchProposals = async () => {
    let proposals = [];
    const client = state.harmony.client;
    const contract = await client.contracts.createContract(PoolsABI, id);
    const attachedContract = await state.walletConnector.attachToContract(contract);
    
    const numProposals = await attachedContract.methods.getNumProposals().call();
    for (let i = 0; i < numProposals; i++) {
      
    }
  }
  
  const isAddressOwner = (address) => {
    return poolMetadata?.owners?.some(owner => owner === address);
  }
  
  const fetchUpdates = async () => {
    await axios.get(`${Constants.SERVER_URL_API}/updates/find/${id}`).then(response => {
      if (response.status !== 200)
        throw new Error();
      setUpdates(response.data.reverse());
    }).catch(error => {
      toast({
        title: "Error fetching updates",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    })
  }
  
  const fetchComments = async () => {
    await axios.get(`${Constants.SERVER_URL_API}/comments/find/${id}`).then(response => {
      if (response.status !== 200)
        throw new Error();
      setComments(response.data.reverse());
    }).catch(async (error) => {
      toast({
        title: "Error fetching comments",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    });
  }
  
  const submitUpdate = async (data) => {
    try {
      const wallet = await axios.get(`${Constants.SERVER_URL_API}/wallets/find/${state.walletAddress}`);
      const signedNonce = await window.onewallet.sign(wallet.data.nonce);
      axios.post(`${Constants.SERVER_URL_API}/updates/create/${id}`, null, {
        params: {
          signature: signedNonce,
          message: data.content,
          address: state.walletAddress,
        }
      }).then(async (response) => {
        if (response.status !== 200 || !forms.updates.formState.isSubmitSuccessful)
          throw new Error();
        fetchUpdates();
        forms.updates.reset({ content: "" });
      });
    } catch (error) {
      toast({
        title: "Error submitting update",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
  const submitComment = async (data) => {
    try {
      const wallet = await axios.get(`${Constants.SERVER_URL_API}/wallets/find/${state.walletAddress}`);
      const signedNonce = await window.onewallet.sign(wallet.data.nonce);
      axios.post(`${Constants.SERVER_URL_API}/comments/create/${id}`, null, {
        params: {
          signature: signedNonce,
          message: data.content,
          address: state.walletAddress,
        }
      }).then(response => {
        fetchComments();
        if (response.status !== 200 || !forms.comments.formState.isSubmitSuccessful)
          throw new Error();
        forms.comments.reset({ content: "" });
      });
    } catch (error) {
      toast({
        title: "Error submitting comment",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
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
  
  // TODO
  const calculateDaysToEnd = () => {
    const days = moment.utc(poolMetadata?.end).diff(moment.utc(), "days");
    if (days >= 100) {
      return "100+ days";
    } else if (days === 0) {
      const hours = moment.utc(poolMetadata?.end).diff(moment.utc(), "hours");
      if (hours >= 1)
        return `${hours} hours`;
      return "< 1 hours";
    }
    return `${days} days`;
  }

  return (
    <SimpleGrid w="full" columns={[1, null, 3]} gap="2rem">
      <ContributeModal id={id} isOpen={isContributeModalOpen} onClose={()=>setIsContributeModalOpen(false)}/>
      <CreateProposalModal id={id} ownersForProposal={poolMetadata?.ownersForProposal} numOwners={poolMetadata?.owners?.length} 
        isOpen={isCreateProposalModalOpen} onClose={()=>setIsCreateProposalModalOpen(false)}/>
      <GridItem colSpan={2}>
        <VStack w="full" h="full" spacing="2rem" align="flex-start">
          <Box w="full">
            <Heading>{poolMetadata?.name}</Heading>
            <Text fontSize="lg">{`Organized by ${poolMetadata?.creator} `}
              <IconButton size="xs" icon={<CopyIcon/>}
                onClick={()=>copyToClipboard(poolMetadata?.creator)}/>
            </Text>
          </Box>
          <Box w="full">
            <Text fontSize="lg">{poolMetadata?.description}</Text>
          </Box>
          <Flex p="1rem" border="1px solid" borderRadius="md" w="full">
            <Tabs isFitted variant="enclosed" maxH="40rem" w="full" overflowY="scroll">
              <TabList>
                <Tab>Updates</Tab>
                <Tab>Proposals</Tab>
                <Tab>Comments</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box mt="1rem">
                    <Box>
                      <Center>
                        { isAddressOwner(state.walletAddress) ? 
                          <FormControl w="full" isInvalid={forms.updates?.formState?.errors?.content?.message} 
                            errortext={forms.updates?.formState?.errors?.content?.message} mb="2rem">
                            <HStack mb="1rem">
                              <Heading size="sm">Submit New Update</Heading>
                              <Spacer/>
                              <Button size="sm" onClick={forms.updates?.handleSubmit(submitUpdate)}>Submit</Button>
                            </HStack>
                            <Textarea placeholder="Your Message (Maximum 1000 Characters)"
                              minHeight="8rem" { ...forms.updates.register("content") } />
                            <FormErrorMessage>{forms.updates?.formState?.errors?.content?.message}</FormErrorMessage>
                            <Heading size="sm" mt="2rem" mb="1rem">{updates.length} Update(s)</Heading>
                            <Divider/>
                          </FormControl>
                         : "" }
                      </Center>
                      { updates.length > 0 ?
                        <Stack spacing="2rem" mt="1rem">
                          {
                            updates.map((update, index) => 
                              <CommentsCard key={`update_${index}`} 
                                item={update} owner={isAddressOwner(update.address)}/>
                            )
                          }
                        </Stack> :
                        <Center>No updates yet.</Center>
                      }
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="1rem">
                    { proposals.length === 0 ?
                      <Stack>
                        { isAddressOwner(state.walletAddress) ? 
                          <Center>
                            <Button onClick={()=>setIsCreateProposalModalOpen(true)} mb="2rem">Submit New Proposal</Button>
                          </Center> : "" }
                        <Center>No proposals yet.</Center>
                      </Stack> :
                      <Box>
                        <Center>
                          { isAddressOwner(state.walletAddress) ? <Button mb="2rem">Submit New Proposal</Button> : "" }
                        </Center>
                        <Stack spacing="2rem">
                          {
                            proposals.reverse().map((proposal, index) => 
                              <ProposalsCard key={`proposal_${index}`} item={proposal} index={proposals.length - index} 
                                ownersForProposal={poolMetadata?.ownersForProposal}/>
                            )
                          }
                        </Stack>
                      </Box>
                    }
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="1rem">
                    <Box>
                      <Center>
                        <FormControl w="full" isInvalid={forms.comments?.formState?.errors?.content?.message} 
                          errortext={forms.comments?.formState?.errors?.content?.message}>
                          <HStack mb="1rem">
                            <Heading size="sm">Submit New Comment</Heading>
                            <Spacer/>
                            <Button size="sm" onClick={forms.comments?.handleSubmit(submitComment)} 
                              isDisabled={!state.walletAddress}>Submit</Button>
                          </HStack>
                          <Textarea placeholder={ state.walletAddress ? "Your Message (Maximum 1000 Characters)" : "Login to submit a comment" }
                            isDisabled={!state.walletAddress} minHeight="8rem" { ...forms.comments.register("content") } />
                          <FormErrorMessage>{forms.comments?.formState?.errors?.content?.message}</FormErrorMessage>
                          <Heading size="sm" mt="2rem" mb="1rem">{comments.length} Comment(s)</Heading>
                          <Divider/>
                        </FormControl>
                      </Center>
                      { comments.length > 0 ?
                        <Stack spacing="2rem" mt="1rem">
                          {
                            comments.map((comment, index) => 
                              <CommentsCard key={`comment_${index}`} 
                                item={comment} owner={isAddressOwner(comment.address)}/>
                            )
                          }
                        </Stack> :
                        <Center mt="2rem">No comments yet.</Center>
                      }
                    </Box>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </VStack>
      </GridItem>
      <GridItem colSpan={1}>
        <VStack w="full" colSpan={1} spacing="2rem" align="flex-start">
          <Button size="lg" w="full" mt="1rem" onClick={()=>setIsContributeModalOpen(true)}>Contribute</Button>
          <Box p="1rem" border="1px solid" borderRadius="md" w="full">
            <Stat>
              <StatLabel>Raised</StatLabel>
              <StatNumber>138,268 out of {poolMetadata?.goal?.toLocaleString()} ONE</StatNumber>
              <StatHelpText>
                <StatArrow type="increase"/>
                28,233 ONE was contributed in the past 7 days
              </StatHelpText>
            </Stat>
            <Progress value={40} size="lg" borderRadius="md" mb="0.5rem"></Progress>
            <HStack mb="0.5rem">
              <InfoOutlineIcon boxSize="1rem"/>
              <Text fontSize="sm">212 Unique Contributors</Text>
            </HStack>
            <HStack mb="0.5rem">
              <CalendarIcon boxSize="1rem"/>
              <Text fontSize="sm">
                { calculateDaysToEnd() } until pool ends (23:59 UTC)
              </Text>
            </HStack>
            <Text fontSize="sm" opacity="0.8">You can still contribute to the pool after the end date.</Text>
          </Box>
          <VStack p={4} border="1px solid" borderRadius="md" w="full">
            <Center fontSize="sm" fontWeight="medium">Share this pool</Center>
            <InputGroup margin={1}>
              <Input border="1px solid" borderRadius="md" isReadOnly
                defaultValue={window.location.href}/>
              <InputRightElement>
                <IconButton size="xs" icon={<CopyIcon/>} 
                  onClick={()=>copyToClipboard(window.location.href)}/>
              </InputRightElement>
            </InputGroup>
          </VStack>
          <VStack p={4} border="1px solid" borderRadius="md" w="full">
            <Text fontSize="sm" fontWeight="medium">Pool Details</Text>
            <Table variant="simple">
              <TableCaption>
                <Link href={`${Constants.EXPLORER_URL_ADDRESS}/${id}`} isExternal>
                  View on Harmony Block Explorer <ExternalLinkIcon size="xs"/>
                </Link>
              </TableCaption>
              <Tbody>
                <Tr>
                  <Td>Created at</Td>
                  <Td>{poolMetadata.end}</Td>
                </Tr>
                <Tr>
                  <Td>Pool ends at</Td>
                  <Td>{poolMetadata.end}</Td>
                </Tr>
                <Tr>
                  <Td>Minimum Owners Required to Pass Proposal</Td>
                  <Td>{poolMetadata.ownersForProposal} out of {poolMetadata.owners?.length} owners</Td>
                </Tr>
              </Tbody>
            </Table>
          </VStack>
          <VStack p={4} border="1px solid" borderRadius="md" w="full" display="block" maxH="16rem" overflowY="scroll">
            <Center fontSize="sm" fontWeight="medium">Pool Owners ({poolMetadata?.owners?.length})</Center>
            <Table w="full">
              <Tbody>
                {
                  poolMetadata?.owners?.map((owner, index) => (
                    <Tr key={`owner_${index}`}>
                      <Td>
                        <Flex>
                          <Link whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" 
                            href={`${Constants.EXPLORER_URL_ADDRESS}/${owner}`} isExternal>{owner}</Link>
                          <ExternalLinkIcon whiteSpace="nowrap" display="inline-block"/>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </VStack>
        </VStack>
      </GridItem>
    </SimpleGrid>
  );
};

export default Pool;
