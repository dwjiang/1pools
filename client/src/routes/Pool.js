import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Center, CircularProgress, CircularProgressLabel, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem,
  Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Link, Progress, SimpleGrid, Spacer, Stack, Stat, StatLabel, StatNumber, Skeleton,
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
import PoolFactoryABI from "abi/PoolFactory";
import io from "socket.io-client";

const Pool = (props) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  let [ poolMetadata, setPoolMetadata ] = useState({});
  let [ comments, setComments ] = useState([]);
  let [ updates, setUpdates ] = useState([]);
  let [ proposals, setProposals ] = useState([]);
  let [ isContributeModalOpen, setIsContributeModalOpen ] = useState(false);
  let [ isCreateProposalModalOpen, setIsCreateProposalModalOpen ] = useState(false);
  let [ loading, setLoading ] = useState(true);
  let [ found, setFound ] = useState(true);
  let [ socket, setSocket ] = useState(null);

  const location = useLocation();
  const { id } = useParams();
  
  const forms = {
    updates: useForm({ mode: "onSubmit", resolver: yupResolver(CommentsSchema)}),
    comments: useForm({ mode: "onSubmit", resolver: yupResolver(CommentsSchema)}),    
  };

  useEffect(() => {
    Promise.all([fetchPoolMetadata(), fetchProposals(), fetchUpdates(), fetchComments()])
      .catch(error => setFound(false)).finally(() => setLoading(false));
    const query = new URLSearchParams({ id }).toString();
    const socket = io(Constants.SERVER_URL_BASE, { query, reconnection: true });
    socket.on("refresh", type => {
      console.log(type);
      switch (type) {
        case "balance":
          fetchBalance();
          break;
        case "comments":
          fetchComments();
          break;
        case "updates":
          fetchUpdates();
          break;
        case "proposals":
          fetchProposals();
          break;
      }
    });
    setSocket(socket);
  }, []);
  
  const fetchPoolMetadata = async () => {
    let metadata = {};
    const client = state.harmony.client;
    const contract = await client.contracts.createContract(PoolsABI, id);
        
    metadata.hash = await contract.methods.getMetadata().call();
    metadata.owners = (await contract.methods.getOwners().call()).map(address => client.crypto.toBech32(address));
    metadata.ownersForProposal = (await contract.methods.getConfirmationsRequired().call()).toNumber();
    
    const createdAt = moment.unix((await contract.methods.getPoolCreatedTime().call()).toNumber()).local();
    metadata.createdAt = moment(createdAt).format("LLL");
    metadata.endsAt = moment(createdAt).add((await contract.methods.getPoolTTL().call()).toNumber(), "days").format("LLL");
        
    await axios.get(`${Constants.PINATA_URL_GATEWAY}/${metadata.hash}`).then(response => {
      if (response.status !== 200)
        throw new Error();
      metadata.name = response.data.name;
      metadata.description = response.data.description;
      metadata.goal = response.data.goal;
    });
    
    await axios.post(`${Constants.HMY_RPC_URL}`, {
      jsonrpc: "2.0",
      id: 1,
      method: "hmyv2_getBalance",
      params: [ id ]
    }).then(response => {
      if (response.status !== 200)
        throw new Error();
      metadata.balance = (response.data.result / 1e18).toLocaleString(undefined, { maximumFractionDigits: 2 });
    });
        
    await axios.post(`${Constants.SERVER_URL_API}/pools/view`, null, {
      params: { id }
    });
    
    await axios.get(`${Constants.SERVER_URL_API}/pools/get-views`, {
      params: { id }
    }).then(response => {
      if (response.status !== 200)
        throw new Error();
      metadata.views = response.data.views;
    });
    
    const factoryContract = await client.contracts.createContract(PoolFactoryABI, Constants.POOLS_FACTORY_ADDRESS);
    metadata.creator = client.crypto.toBech32(await factoryContract.methods.getCreator(id).call());

    setPoolMetadata({ ...poolMetadata, ...metadata });
  }
  
  const fetchBalance = async () => {
    await axios.post(`${Constants.HMY_RPC_URL}`, {
      jsonrpc: "2.0",
      id: 1,
      method: "hmyv2_getBalance",
      params: [ id ]
    }).then(response => {
      if (response.status !== 200)
        throw new Error();
      setPoolMetadata({ ...poolMetadata, 
        balance: (response.data.result / 1e18).toLocaleString(undefined, { maximumFractionDigits: 2 }) 
      });
    });
  }
  
  const fetchProposals = async () => {
    let proposals = [];
    const client = state.harmony.client;
    const contract = await client.contracts.createContract(PoolsABI, id);
    
    const numProposals = (await contract.methods.getNumProposals().call()).toNumber();
    for (let i = 0; i < numProposals; i++) {
      let proposal = { numConfirmations: {} };
      const proposalData = await contract.methods.getProposal(i).call();
      proposal.destination = client.crypto.toBech32(proposalData[0]);
      proposal.amount = parseInt(proposalData[1]);
      proposal.executed = proposalData[2];
      proposal.data = String.fromCharCode(...client.crypto.hexToByteArray(proposalData[3]));
      proposal.createdAt = moment.unix(proposalData[4]).local().format("LLL");
      proposal.proposedBy = client.crypto.toBech32(proposalData[5]);
      
      for (let j = 0; j < 4; j++) {
        proposal.numConfirmations[j] = (await contract.methods.getProposalNumConfirmations(i, j).call()).toNumber();
      }
      proposals.push(proposal);
    }
    setProposals(proposals);
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
        socket.emit("refresh", "updates");
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
        socket.emit("refresh", "comments");
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
  
  const calculateDaysToEnd = () => {
    const days = moment(poolMetadata?.endsAt).diff(moment(), "days");
    if (days >= 100) {
      return "100+ days";
    } else if (days === 0) {
      const hours = moment(poolMetadata?.endsAt).diff(moment(), "hours");
      if (hours >= 1)
        return `${hours} hours`;
      return "< 1 hour";
    }
    return `${days} days`;
  }
  
  const createProposalOnSubmit = async (data) => {
    try {
      const client = state.harmony.client;
      const contract = await client.contracts.createContract(PoolsABI, id);
      const attachedContract = await state.walletConnector.attachToContract(contract);
      await attachedContract.methods.createProposal(data.address, data.amount, client.crypto.hexToByteArray(new Buffer(data.message).toString("hex"))).send({
        from: state.walletConnector.address,
        gasPrice: state.harmony.gasPrice * 30,
        gasLimit: state.harmony.gasLimit,
      }).on("receipt", receipt => {
        proposalOnUpdate();
        setIsCreateProposalModalOpen(false);
      });
    } catch (error) {
      toast({
        title: "Error submitting proposal",
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  }
  
  const proposalOnUpdate = async () => {
    socket.emit("refresh", "proposals");
    fetchProposals();
  }
  
  if (loading) {
    return (
      <SimpleGrid w="full" columns={[1, null, 3]} gap="2rem">
        <GridItem colSpan={2} mt="1rem">
          <Stack>
            <Skeleton h="6rem"/>
            <Skeleton h="80rem"/>
          </Stack>
        </GridItem>
        <Skeleton mt="1rem">
          <GridItem colSpan={1}/>
        </Skeleton>      
      </SimpleGrid>
    );
  }
  
  if (!found) {
    return (
      <Center h="90%">
        <Text fontSize="lg">Error fetching pool or pool does not exist. Please try refreshing the page or check the address in the URL.</Text>
      </Center>
    );
  }
  
  return (
    <SimpleGrid w="full" columns={[1, null, 3]} gap="2rem">
      <ContributeModal id={id} isOpen={isContributeModalOpen} onClose={()=>setIsContributeModalOpen(false)}/>
      <CreateProposalModal id={id} ownersForProposal={poolMetadata?.ownersForProposal} numOwners={poolMetadata?.owners?.length} 
        isOpen={isCreateProposalModalOpen} onClose={()=>setIsCreateProposalModalOpen(false)} onSubmit={createProposalOnSubmit}/>
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
                            <Heading size="sm" mt="2rem">{updates.length} Update(s)</Heading>
                            <Divider/>
                          </FormControl>
                         : "" }
                      </Center>
                      { updates.length > 0 ?
                        <Stack spacing="2rem">
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
                          { isAddressOwner(state.walletAddress) ? <Button mb="2rem" onClick={()=>setIsCreateProposalModalOpen(true)}>Submit New Proposal</Button> : "" }
                        </Center>
                        <Stack spacing="2rem">
                          {
                            proposals.reverse().map((proposal, index) => 
                              <ProposalsCard key={`proposal_${index}`} id={id} item={proposal} index={proposals.length - index} 
                                ownersForProposal={poolMetadata?.ownersForProposal} onUpdate={proposalOnUpdate} endsAt={poolMetadata?.endsAt}/>
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
              <StatNumber>{`${poolMetadata?.balance?.toLocaleString()} out of ${poolMetadata?.goal?.toLocaleString()} ONE`}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase"/>
                {`${poolMetadata.views} have viewed this pool in the past 7 days`}
              </StatHelpText>
            </Stat>
            <Progress value={poolMetadata?.balance / poolMetadata?.goal * 100} size="lg" borderRadius="md" mb="0.5rem"></Progress>
            <HStack mb="0.5rem">
              <CalendarIcon boxSize="1rem"/>
              <Text fontSize="sm">
                { moment(poolMetadata?.endsAt).diff(moment(), "seconds") > 0 ?
                  `${calculateDaysToEnd()} until this pool ends` :
                  `Pool has ended`
                }
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
                  <Td>{poolMetadata.createdAt}</Td>
                </Tr>
                <Tr>
                  <Td>Pool ends at</Td>
                  <Td>{poolMetadata.endsAt}</Td>
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
