import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [shouldOpenAddProduct, setShouldOpenAddProduct] = useState(false);

  const triggerAddProduct = () => {
    setShouldOpenAddProduct(true);
  };

  const resetAddProductTrigger = () => {
    setShouldOpenAddProduct(false);
  };

  return (
    <ProductContext.Provider value={{
      shouldOpenAddProduct,
      triggerAddProduct,
      resetAddProductTrigger
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
