import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Input,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuthContext } from "../contexts/authContext";
import { useEffect, useState } from "react";
import AddProductForm from "./addProductForm";

const AnonLinks = [{ href: "login", title: "Login" }];
const LoggedInLinks = [
  { href: "logout", title: "Logout" },
];

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, logout } = useAuthContext();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuLinks, setMenuLinks] = useState(AnonLinks);

  const NavLink = ({ children, href }) => (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={href}
      onClick={(e) => {
        if (children === "Logout") {
          e.preventDefault();
          localStorage.removeItem("token");
          logout();
        }
      }}
    >
      {children}
    </Link>
  );

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      setMenuLinks(LoggedInLinks);
    } else {
      setIsLoggedIn(false);
      setMenuLinks(AnonLinks);
    }
  }, [token]);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={4} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {isLoggedIn && (
                <AddProductForm />
              )}
            </HStack>
          </HStack>
          {/* Place a search input field in the middle of the NavBar */}
          <HStack
            as={"nav"}
            spacing={4}
            display={{ base: "none", md: "flex" }}
            paddingRight={20}
          >
            {isLoggedIn ? (
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={() => logout()}
              >
                Logout
              </Button>
            ) : (
              <NavLink key={2} href="/login">
                Login
              </NavLink>
            )}
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {menuLinks.map(({ href, title }) => (
                <NavLink key={href} href={href}>
                  {title}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
