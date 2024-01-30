import React, { createContext, useContext, useEffect, useState } from "react";
import { CustomAlert } from "../../components";
const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    if (isAlertVisible) {
      setTimeout(() => {
        setIsAlertVisible(false);
        setData({});
      }, 3000);
    }
  }, [data]);

  const showAlert = (type, message) => {
    setData({ type, message });
    setIsAlertVisible(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert, data, isAlertVisible }}>
      {isAlertVisible && <CustomAlert data={data} />}
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
