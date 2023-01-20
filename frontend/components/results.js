import { Grid, Heading } from "@chakra-ui/react";
import Product from "./product";

export default function Results({ products }) {
  return products ? (
    <Grid
      w="full"
      gridGap="5"
      gridTemplateColumns="repeat( auto-fit, minmax(300px, 1fr) )"
    >
      {products.map((p) => (
        <Product product={p} key={p.product_id} />
      ))}
    </Grid>
  ) : (
    <Heading>No results found</Heading>
  );
}
