import React from "react";
import Header from "components/header/Header";
import Footer from "components/footer/Footer";
import { ChakraProvider, Stack, ThemeProvider, ColorModeProvider, CSSReset, extendTheme } from "@chakra-ui/react";
import { Provider } from "./store";
import { Web3ReactProvider } from "@web3-react/core";
import { StepsStyleConfig } from "chakra-ui-steps";
import Pages from "routes";
import Web3 from "web3";

const GlobalStateProvider = ({ children }) => (
  <Provider>{children}</Provider>
)

const getLibrary = (provider) => (
  new Web3(provider)
)

const theme = extendTheme({
  components: {
    Steps: StepsStyleConfig,
  }
});

export default function () {
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <ColorModeProvider options={{}}>
          <GlobalStateProvider>
            <CSSReset/>
            <Web3ReactProvider getLibrary={getLibrary}>
              <Stack style={{height: "100vh"}}>
                <Header/>
                <Pages/>
                <Footer/>
              </Stack>
            </Web3ReactProvider>
          </GlobalStateProvider>
        </ColorModeProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
