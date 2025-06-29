import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [shouldOpenAddUser, setShouldOpenAddUser] = useState(false);

  const triggerAddUser = () => {
    setShouldOpenAddUser(true);
  };

  const resetAddUserTrigger = () => {
    setShouldOpenAddUser(false);
  };

  return (
    <UserContext.Provider value={{
      shouldOpenAddUser,
      triggerAddUser,
      resetAddUserTrigger
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
