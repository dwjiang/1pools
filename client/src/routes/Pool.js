import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Center, CircularProgress, CircularProgressLabel, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem,
  Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Link, Progress, SimpleGrid, Spacer, Stack, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, StatGroup, Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Text, Textarea, VStack, useToast } from "@chakra-ui/react";
import { CalendarIcon, CopyIcon, ExternalLinkIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useTrackedState, useSetState } from "store";
import { useLocation, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommentsCard from "components/pools/view/CommentsCard";
import ProposalsCard from "components/pools/view/ProposalsCard";
import CommentsSchema from "validations/schemas/CommentsSchema";
import yup from "validations/validations";
import * as Constants from "constants/Constants";
import * as Utils from "utils/Utils";
import moment from "moment";

const debug = false;
const green = debug ? "green" : "white";
const red = debug ? "red" : "white";

const Pool = (props) => {
  const toast = useToast();
  let [ state, dispatch ] = [ useTrackedState(), useSetState() ];
  let [ poolMetadata, setPoolMetadata ] = useState({});
  let [ comments, setComments ] = useState([]);
  let [ updates, setUpdates ] = useState([]);
  let [ proposals, setProposals ] = useState([]);

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
    setPoolMetadata({
      name: "Secret Birthday Present for Jordan (Bike)",
      description: 
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor at risus viverra adipiscing at in tellus integer. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Odio eu feugiat pretium nibh ipsum consequat. Neque ornare aenean euismod elementum nisi. Aliquet risus feugiat in ante metus. Mi quis hendrerit dolor magna eget est lorem. Leo in vitae turpis massa sed elementum. Non odio  euismod lacinia at. Eget est lorem ipsum dolor sit. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Egestas diam in arcu cursus euismod quis. Magna ac placerat vestibulum lectus mauris ultrices eros in. Vulputate enim nulla aliquet porttitor lacus luctus accumsan. Ultrices gravida dictum fusce ut. Viverra vitae congue eu consequat.

        Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Vitae sapien pellentesque habitant morbi tristique. Nunc scelerisque viverra mauris in aliquam sem fringilla ut. Tristique magna sit amet purus gravida quis blandit turpis. Sodales neque sodales ut etiam sit amet nisl. Suscipit tellus mauris a diam maecenas sed. Integer malesuada nunc vel risus commodo viverra maecenas. Ultrices dui sapien eget mi proin sed libero enim sed. Sagittis orci a scelerisque purus semper. Ultricies leo integer malesuada nunc vel risus. Lectus magna fringilla urna porttitor. Nulla aliquet porttitor lacus luctus accumsan tortor posuere ac. Hac habitasse platea dictumst vestibulum rhoncus. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et.`,
      goal: 345670,
      end: "2022-02-11",
      owners: [
        { name: "Daniel", address: "one1guspucjg2tjn7g9d4nkrq5l0gq9xmwqe65kvry" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
        { name: "Kelly", address: "one1alfiucjg2tjn7g9d4nkrq5ljgq9xmwqe8laksm" },
      ],
      ownersForProposal: 2,
    });
    fetchUpdates();
    fetchComments();
  }, []);
  
  const isAddressOwner = (address) => {
    return poolMetadata?.owners?.some(owner => owner.address === address);
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

  return (
    <SimpleGrid w="full" columns={[1, null, 3]} gap="2rem">
      <GridItem colSpan={2}>
        <VStack w="full" h="full" spacing="2rem" align="flex-start" bg={red}>
          <Box w="full" bg={green}>
            <Heading>{poolMetadata.name}</Heading>
            <Text fontSize="lg">{`Organized by ${poolMetadata?.owners?.[0]?.name} 
              (${Utils.shortenWalletAddress(poolMetadata?.owners?.[0]?.address)}) `}
              <IconButton size="xs" icon={<CopyIcon/>}/>
            </Text>
          </Box>
          <Box w="full" bg={green}>
            <Text fontSize="lg">{poolMetadata.description}</Text>
          </Box>
          <Flex bg={green} p="1rem" border="1px solid" borderRadius="md" w="full">
            <Tabs isFitted variant="enclosed" maxH="50rem" w="full" overflowY="scroll">
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
                            errortext={forms.updates?.formState?.errors?.content?.message}>
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
                        <Center mt="2rem">No updates yet.</Center>
                      }
                    </Box>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mt="1rem">
                    { proposals.length === 0 ?
                      <Stack>
                        { isAddressOwner(state.walletAddress) ? <Center><Button mb="2rem">Submit New Proposal</Button></Center> : "" }
                        <Center>No proposals yet.</Center>
                      </Stack> :
                      <Box>
                        <Center>
                          { isAddressOwner(state.walletAddress) ? <Button mb="2rem">Submit New Proposal</Button> : "" }
                        </Center>
                        <Stack spacing="2rem">
                          {
                            proposals.map(proposal => <ProposalsCard item={proposal}/>)
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
                            <Button size="sm" onClick={forms.comments?.handleSubmit(submitComment)}>Submit</Button>
                          </HStack>
                          <Textarea placeholder="Your Message (Maximum 1000 Characters)"
                            minHeight="8rem" { ...forms.comments.register("content") } />
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
        <VStack w="full" colSpan={1} spacing="2rem" align="flex-start" bg={red}>
          <Button size="lg" w="full" mt="1rem">Contribute</Button>
          <Box bg={green} p="1rem" border="1px solid" borderRadius="md" w="full">
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
                { moment.utc(poolMetadata?.end).diff(moment.utc(), "days") + 1 } days until pool ends
              </Text>
            </HStack>
            <Text fontSize="sm" opacity="0.8">You can still contribute to the pool after the end date.</Text>
          </Box>
          <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
            <Center fontSize="sm" fontWeight="medium">Share this pool</Center>
            <InputGroup margin={1}>
              <Input border="1px solid" borderRadius="md" isReadOnly
                defaultValue={window.location.href}/>
              <InputRightElement>
                <IconButton size="xs" icon={<CopyIcon/>}/>
              </InputRightElement>
            </InputGroup>
          </VStack>
          <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
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
          <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full" display="block" maxH="16rem" overflowY="scroll">
            <Center fontSize="sm" fontWeight="medium">Pool Owners ({poolMetadata?.owners?.length})</Center>
            <Table variant="striped" w="full">
              <Thead>
                <Tr>
                  <Th>Owner</Th>
                  <Th>Owner Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  poolMetadata?.owners?.map((owner, index) => (
                    <Tr key={`owner_${index}`}>
                      <Td>{owner.name}</Td>
                      <Td whiteSpace="nowrap">
                        <Link href={`${Constants.EXPLORER_URL_ADDRESS}/${owner.address}`} isExternal>
                          {Utils.shortenWalletAddress(owner.address)} <ExternalLinkIcon size="xs"/>
                        </Link>
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

// return (
//   <Flex display="flex" direction="row" flexWrap="wrap">
//     <Stack h="fit-content" w="66.6%" spacing="2rem" bg={red} boxSizing="border-box">
//       <Box w="full" bg={green}>
//         <Heading>{poolMetadata.name}</Heading>
//         <Text fontSize="lg">{`Organized by ${poolMetadata?.owners?.[0]?.name} 
//           (${Utils.shortenWalletAddress(poolMetadata?.owners?.[0]?.address)}) `}
//           <IconButton size="xs" icon={<CopyIcon/>}/>
//         </Text>
//       </Box>
//       <Box w="full" bg={green}>
//         <Text fontSize="lg">{poolMetadata.description}</Text>
//       </Box>
//     </Stack>
//     <Stack h="fit-content" w="33.3%" spacing="2rem" bg={red} boxSizing="border-box">
//       <Button size="lg" w="full" mt="1rem">Contribute</Button>
//       <Box bg={green} p="1rem" border="1px solid" borderRadius="md" w="full">
//         <Stat>
//           <StatLabel>Raised</StatLabel>
//           <StatNumber>138,268 out of {poolMetadata?.goal?.toLocaleString()} ONE</StatNumber>
//           <StatHelpText>
//             <StatArrow type="increase"/>
//             28,233 ONE was contributed in the past 7 days
//           </StatHelpText>
//         </Stat>
//         <Progress value={40} size="lg" borderRadius="md" mb="0.5rem"></Progress>
//         <HStack mb="0.5rem">
//           <InfoOutlineIcon boxSize="1rem"/>
//           <Text fontSize="sm">212 Unique Contributors</Text>
//         </HStack>
//         <HStack mb="0.5rem">
//           <CalendarIcon boxSize="1rem"/>
//           <Text fontSize="sm">
//             {moment.utc(poolMetadata?.end).diff(moment.utc(), "days") + 1} days until pool ends
//           </Text>
//         </HStack>
//         <Text fontSize="sm" opacity="0.8">You can still contribute to the pool after the end date.</Text>
//       </Box>
//       <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
//         <Center fontSize="sm" fontWeight="medium">Share this pool</Center>
//         <InputGroup margin={1}>
//           <Input border="1px solid" borderRadius="md" isReadOnly
//             defaultValue={window.location.href}/>
//           <InputRightElement>
//             <IconButton size="xs" icon={<CopyIcon/>}/>
//           </InputRightElement>
//         </InputGroup>
//       </VStack>
//       <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
//         <Text fontSize="sm" fontWeight="medium">Pool Details</Text>
//         <Table>
//           <TableCaption>
//             <Link href={`${Constants.EXPLORER_URL_ADDRESS}/${id}`} isExternal>
//               View on Harmony Block Explorer <ExternalLinkIcon size="xs"/>
//             </Link>
//           </TableCaption>
//           <Tbody>
//             <Tr>
//               <Td>Created at</Td>
//               <Td>{poolMetadata.end}</Td>
//             </Tr>
//             <Tr>
//               <Td>Pool ends at</Td>
//               <Td>{poolMetadata.end}</Td>
//             </Tr>
//             <Tr>
//               <Td>Minimum Owners Required to Pass Proposal</Td>
//               <Td>{poolMetadata.ownersForProposal} out of {poolMetadata.owners?.length} owners</Td>
//             </Tr>
//           </Tbody>
//         </Table>
//       </VStack>
//       <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
//         <Text fontSize="sm" fontWeight="medium">Pool Owners</Text>
//         <Table maxH="20rem" overflowY="scroll">
//           <Thead>
//             <Tr>
//               <Td>Owner</Td>
//               <Td>Owner Address</Td>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {
//               poolMetadata?.owners?.map((owner, index) => (
//                 <Tr key={`owner_${index}`}>
//                   <Td>{owner.name}</Td>
//                   <Td>
//                     <Link href={`${Constants.EXPLORER_URL_ADDRESS}/${owner.address}`} isExternal>
//                       {owner.address} <ExternalLinkIcon size="xs"/>
//                     </Link>
//                   </Td>
//                 </Tr>
//               ))
//             }
//           </Tbody>
//         </Table>
//       </VStack>
//     </Stack>
//     <Stack h="fit-content" w="66.6%" bg={green} p="1rem" border="1px solid" borderRadius="md" boxSizing="border-box">
//       <Tabs isFitted variant="enclosed">
//         <TabList>
//           <Tab>Updates</Tab>
//           <Tab>Proposals</Tab>
//           <Tab>Comments</Tab>
//         </TabList>
//         <TabPanels>
//           <TabPanel>
//           </TabPanel>
//           <TabPanel>
//           </TabPanel>
//           <TabPanel>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </Stack>
//   </Flex>
// );

// return (
//   <SimpleGrid w="full" autoRows="min-content" columns={[1, null, 3]} gap="2rem">
//     <GridItem colSpan={2}>
//       <VStack w="full" spacing="2rem" align="flex-start" bg={red}>
//         <Box w="full" bg={green}>
//           <Heading>{poolMetadata.name}</Heading>
//           <Text fontSize="lg">{`Organized by ${poolMetadata?.owners?.[0]?.name} 
//             (${Utils.shortenWalletAddress(poolMetadata?.owners?.[0]?.address)}) `}
//             <IconButton size="xs" icon={<CopyIcon/>}/>
//           </Text>
//         </Box>
//         <Box w="full" bg={green}>
//           <Text fontSize="lg">{poolMetadata.description}</Text>
//         </Box>
//       </VStack>
//     </GridItem>
//     <GridItem colSpan={1}>
//       <VStack w="full" colSpan={1} spacing="2rem" align="flex-start" bg={red}>
//         <Button size="lg" w="full" mt="1rem">Contribute</Button>
//         <Box bg={green} p="1rem" border="1px solid" borderRadius="md" w="full">
//           <Stat>
//             <StatLabel>Raised</StatLabel>
//             <StatNumber>138,268 out of {poolMetadata?.goal?.toLocaleString()} ONE</StatNumber>
//             <StatHelpText>
//               <StatArrow type="increase"/>
//               28,233 ONE was contributed in the past 7 days
//             </StatHelpText>
//           </Stat>
//           <Progress value={40} size="lg" borderRadius="md" mb="0.5rem"></Progress>
//           <HStack mb="0.5rem">
//             <InfoOutlineIcon boxSize="1rem"/>
//             <Text fontSize="sm">212 Unique Contributors</Text>
//           </HStack>
//           <HStack mb="0.5rem">
//             <CalendarIcon boxSize="1rem"/>
//             <Text fontSize="sm">
//               {moment.utc(poolMetadata?.end).diff(moment.utc(), "days") + 1} days until pool ends
//             </Text>
//           </HStack>
//           <Text fontSize="sm" opacity="0.8">You can still contribute to the pool after the end date.</Text>
//         </Box>
//         <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
//           <Center fontSize="sm" fontWeight="medium">Share this pool</Center>
//           <InputGroup margin={1}>
//             <Input border="1px solid" borderRadius="md" isReadOnly
//               defaultValue={window.location.href}/>
//             <InputRightElement>
//               <IconButton size="xs" icon={<CopyIcon/>}/>
//             </InputRightElement>
//           </InputGroup>
//         </VStack>
//         <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
//           <Text fontSize="sm" fontWeight="medium">Pool Details</Text>
//           <Table>
//             <TableCaption>
//               <Link href={`${Constants.EXPLORER_URL_ADDRESS}/${id}`} isExternal>
//                 View on Harmony Block Explorer <ExternalLinkIcon size="xs"/>
//               </Link>
//             </TableCaption>
//             <Tbody>
//               <Tr>
//                 <Td>Created at</Td>
//                 <Td>{poolMetadata.end}</Td>
//               </Tr>
//               <Tr>
//                 <Td>Pool ends at</Td>
//                 <Td>{poolMetadata.end}</Td>
//               </Tr>
//               <Tr>
//                 <Td>Minimum Owners Required to Pass Proposal</Td>
//                 <Td>{poolMetadata.ownersForProposal} out of {poolMetadata.owners?.length} owners</Td>
//               </Tr>
//             </Tbody>
//           </Table>
//         </VStack>
//         <VStack bg={green} p={4} border="1px solid" borderRadius="md" w="full">
//           <Text fontSize="sm" fontWeight="medium">Pool Owners</Text>
//           <Table tableLayout="fixed" maxH="20rem" overflowY="scroll">
//             <Thead>
//               <Tr>
//                 <Td>Owner</Td>
//                 <Td>Owner Address</Td>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {
//                 poolMetadata?.owners?.map((owner, index) => (
//                   <Tr key={`owner_${index}`}>
//                     <Td>{owner.name}</Td>
//                     <Td>
//                       <Link href={`${Constants.EXPLORER_URL_ADDRESS}/${owner.address}`} isExternal>
//                         {owner.address} <ExternalLinkIcon size="xs"/>
//                       </Link>
//                     </Td>
//                   </Tr>
//                 ))
//               }
//             </Tbody>
//           </Table>
//         </VStack>
//       </VStack>
//     </GridItem>
//     <GridItem colSpan={2}>
//       <Box bg={green} p="1rem" border="1px solid" borderRadius="md" w="full">
//         <Tabs isFitted variant="enclosed">
//           <TabList>
//             <Tab>Updates</Tab>
//             <Tab>Proposals</Tab>
//             <Tab>Comments</Tab>
//           </TabList>
//           <TabPanels>
//             <TabPanel>
//             </TabPanel>
//             <TabPanel>
//             </TabPanel>
//             <TabPanel>
//             </TabPanel>
//           </TabPanels>
//         </Tabs>
//       </Box>
//     </GridItem>
//   </SimpleGrid>
// );
