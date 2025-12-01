"use client"
import { CompanyResponse } from '@/types/company/http';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'

export type UserContextType = {
  user: boolean;
  setUser: Dispatch<SetStateAction<boolean>>
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserContextWrapper = ({ children }: any) => {
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {

    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("saved_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContextWrapper, UserContext }