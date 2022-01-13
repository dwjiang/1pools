import { Box, Center, Heading, Link, Stack, Text } from "@chakra-ui/react"

const Home = () => (
  <Center h="130%">
    <Stack maxW="container.md">
      <Center fontSize="6xl"><strong>🏊</strong></Center>
      <Center fontSize="lg"><strong>Introduction</strong></Center>
      <Center>Currently, we have a great variety of group fundraising financial services such as Venmo, PayPal, GoFundMe, etc. to choose from, but a common theme amongst these services is that there is usually only one "owner"; only one person is in charge of all the funds. We wanted to expand on the idea of decentralized finance to better fit our day to day scenarios and allow everyone in a group an equal stance by using a voting system.</Center>
      <Box h="1rem"/>
      <Center fontSize="lg"><strong>What is 1pools? How does it work?</strong></Center>
      <Center>1pools is a decentralized service for group fundraising/payment splitting, running on the Harmony One Blockchain. You can use 1pools to fundraise specific items or events like birthday parties, group trips, or even group rent payments.</Center>
      <Center>Beneath the hood, a pool is essentially a multi-signature wallet, shared between all specified "owners" of the pool. Given that every 1pool is a public address, anyone, even those who are not owners, can contribute $ONE to the pool. During pool creation, you can specify pool details, owners, and voting rules for proposals of the pool.</Center>
      <Center>Pool proposals are basically proposed transactions to send the $ONE stored inside the pool to a specified destination wallet. In order to pass and execute a proposal, the proposal would need to reach a certain number of yes votes, which is specified at the time of pool creation.</Center>
      <Center>Having owner privilege not only will give access to the pool's update section, but also allow them to create proposals and cast votes on these proposals. For example, given a pool has 5 owners and the minimum owners needed to pass a proposal is set to 3, every proposal will require at least 3 yes votes in order for the proposal to be executed.</Center>
      <Center>Proposals, voting, and most pool information are stored on-chain. The name, description, and goal amount of the pool are stored in IPFS. Comments, however, are stored off-chain in a centralized server.</Center>
      <Center>For more detailed information, visit the&nbsp;<Link href="https://github.com/dwjiang/1pools/blob/main/README.md" textDecoration="underline" isExternal>GitHub</Link>.</Center>
      <Box h="1rem"/>
      <Center fontSize="lg"><strong>Getting Started</strong></Center>
      <Center>1. Connect your Harmony Wallet Chrome Extension.</Center>
      <Center>2. Go to&nbsp;"<Link href="create-pool" textDecoration="underline">Create Pool</Link>"&nbsp;page.</Center>
      <Center>3. Enter the general information and owners for you pool.</Center>
      <Center>4. Review your pool information and submit your pool.</Center>
      <Box h="4rem"/>
    </Stack>
  </Center>
);

export default Home;
