import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { GetCurrentUser } from "@app/api/GetCurrentUser";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface UserContextProps {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await GetCurrentUser();
        setCurrentUser(response);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
