import { Routes, Route } from "react-router-dom";
import { Center, Container, Flex } from "@chakra-ui/react"
import styles from "routes/index.module.css";

const Pages = () => (
  <Flex justify="center" className={styles.container}>
    <Container maxW="container.lg">
      <Routes>
      </Routes>
    </Container>
  </Flex>
);

export default Pages;
