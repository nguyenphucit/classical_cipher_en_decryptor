import React, { createContext, useState } from "react";
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [PlainText, setPlainText] = useState("");
  const [CipherText, setCipherText] = useState("");
  return (
    <AppContext.Provider
      value={{ PlainText, setPlainText, CipherText, setCipherText }}
    >
      {children}
    </AppContext.Provider>
  );
};
