import * as React from "react";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import "../styles/global.css";
import theme from "../styles/theme";
import { ThemeProvider } from "@emotion/react";

function App({ Component, pageProps }) {

  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default App;
