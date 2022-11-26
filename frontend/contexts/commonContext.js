import { createContext, useContext, useState } from "react";

const CommonContext = createContext({});
CommonContext.displayName = "CommonContext";

const SEARCH_ENDPOINT = `${process.env.NEXT_PUBLIC_SEARCH_SERVICE_BASE_URL}`;

export const CommonProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchProducts = async (searchTerm) => {
    try {
      setLoading(true);
      const res = await fetch(`${SEARCH_ENDPOINT}/search?name=${searchTerm}`);
      const products = await res.json();
      setLoading(false);
      if (res.ok) {
        setProducts(products);
      }
      setProducts(products);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <CommonContext.Provider
      value={{
        loading,
        setLoading,
        fetchProducts,
        products
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  const context = useContext(CommonContext);
  if (!context)
    throw new Error(`useCommonContext must be used within CommonContext`);

  return context;
};
