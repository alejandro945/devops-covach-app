import { useState, useEffect } from "react";

import {
  Container,
  VStack,
  Flex,
  Heading,
  Input,
  Button,
} from "@chakra-ui/react";
import NavBar from "../components/navbar";
import Results from "../components/results";
import { useCommonContext } from "../contexts/commonContext";



export default function Home() {
  
  const [searchTerm, setSearchTerm] = useState("");

  const { loading, products, fetchProducts } = useCommonContext();

  useEffect(() => {
    const initialLoad = async () => {
      await handleSearch();
    }

    initialLoad();
  }, []);

  const handleSearch = async () => {
    await fetchProducts(searchTerm);
    setSearchTerm("");
  }

  return (
    <>
      <NavBar />
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={4}
      >
        <Heading>Welcome to Covachapp</Heading>
      </Flex>
      {/* <AddProductForm /> */}
      <Container maxW="container.xl" padding={50} marginTop={10}>
        <Input placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}/>
        <Button colorScheme="teal" type="submit" onClick={handleSearch}>Search</Button>
      </Container>
      <Flex
        direction="column"
        padding={10}
        maxW={{ xl: "1200px" }}
        m="0 auto"
        minH="100vh"
      >
        {loading ? (<Heading>Loading...</Heading>) : (
         <Results products={products} />
        )}
        
      </Flex>
    </>
  );
}
