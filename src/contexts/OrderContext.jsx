import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [shouldOpenAddOrder, setShouldOpenAddOrder] = useState(false);

  const openCreateOrderDialog = () => {
    setIsCreateOrderDialogOpen(true);
  };

  const closeCreateOrderDialog = () => {
    setIsCreateOrderDialogOpen(false);
  };

  const triggerAddOrder = () => {
    setShouldOpenAddOrder(true);
  };

  const resetAddOrderTrigger = () => {
    setShouldOpenAddOrder(false);
  };

  const value = {
    isCreateOrderDialogOpen,
    openCreateOrderDialog,
    closeCreateOrderDialog,
    setIsCreateOrderDialogOpen,
    shouldOpenAddOrder,
    triggerAddOrder,
    resetAddOrderTrigger
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
