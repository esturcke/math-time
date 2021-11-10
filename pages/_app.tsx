import type { AppProps } from "next/app";
import { Center, ChakraProvider } from "@chakra-ui/react";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider>
    <Center h="100vh">
      <Component {...pageProps} />
    </Center>
  </ChakraProvider>
);

export default MyApp;
