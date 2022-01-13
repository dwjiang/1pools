import { Routes, Route } from "react-router-dom";
import { Box, Center, Container, Flex } from "@chakra-ui/react"
import CreatePool from "routes/CreatePool";
import Pool from "routes/Pool";
import Pools from "routes/Pools";
import Home from "routes/Home";
import styles from "routes/index.module.css";

const Pages = () => (
  <Flex justify="center" className={styles.container} h="full">
    <Container maxW="container.xl">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create-pool" element={<CreatePool/>}/>
        <Route path="/pools" element={<Pools/>}/>
        <Route path="/pools/:id" element={<Pool/>}/>
      </Routes>
      <Box minHeight="2rem"/>
    </Container>
  </Flex>
);

export default Pages;
