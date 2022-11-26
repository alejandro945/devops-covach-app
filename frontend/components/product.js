import { Text, Image, Box, Stack, Heading } from "@chakra-ui/react";

const Product = ({ product: {name, description, price, image} }) => (
  <Stack p={{ base: "0 2rem" }}>
    <Image objectFit="cover" src={image} alt={description} boxSize='250px'/>
    <Text color="teal.600" textTransform="uppercase">
      {description}
    </Text>

    <Heading color="teal.300" size="md" textTransform="capitalize">
      {name}
    </Heading>
    <Box>
      {price}
      <Box as="span" color="gray.600" fontSize="sm">
        / night
      </Box>
    </Box>
  </Stack>
);

export default Product;
