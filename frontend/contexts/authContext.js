import { createContext, useContext, useState, useEffect } from "react";

import Cookies from "js-cookie";

const AuthContext = createContext({});
AuthContext.displayName = "AuthContext";

const AUTH_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_BASE_URL + "/api/token/";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      console.log("Token exists in landing app: ", token);
    } else {
      console.log("Token DOES NOT exist");
    }
  }, [token]);

  const login = async (email, password) => {
    
    const res = await fetch(AUTH_SERVICE_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
        setToken(data.access);
        Cookies.set("token", data.access);
        window.location.href = "/";
    } else {
        console.log("Error logging in");
        setError(true);
    }
  };

  const logout = () => {
    // Remove the token from the state
    setToken(null);

    // Remove the token from the cookies
    Cookies.remove("token");

    // Redirect to the home page
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        error,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(`useAuthContext must be used within AuthProvider`);

  return context;
};
