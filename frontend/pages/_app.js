import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/authContext";
import { CommonProvider } from "../contexts/commonContext";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CommonProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </CommonProvider>
    </ChakraProvider>
  );
}

export default MyApp;
