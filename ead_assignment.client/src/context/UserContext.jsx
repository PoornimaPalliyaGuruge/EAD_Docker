import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.token) {
      setUserData(storedUserData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  );
};
