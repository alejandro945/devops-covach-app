import { useState } from "react";
import { Flex, Heading, Input, Button } from "@chakra-ui/react";
import { useAuthContext } from "../contexts/authContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: doLogin, error: loginError, setError } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password });
    await doLogin(email, password);
  };

  const handleInputChange = (field, value) => {
    setError(false);
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded={6}>
        <Heading mb={6}>Login Page</Heading>
        <Input
          errorBorderColor="crimson"
          isInvalid={loginError}
          placeholder="Email"
          variant="filled"
          mb={3}
          type="email"
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <Input
          errorBorderColor="crimson"
          isInvalid={loginError}
          placeholder="Password"
          variant="filled"
          mb={6}
          type="password"
          onChange={(e) => handleInputChange('password', e.target.value)}
        />
        {loginError && (
          <Heading size="sm" color="crimson">
            Invalid email or password
          </Heading>
        )}
        <Button colorScheme="teal" type="submit" onClick={handleSubmit}>
          Log in
        </Button>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
