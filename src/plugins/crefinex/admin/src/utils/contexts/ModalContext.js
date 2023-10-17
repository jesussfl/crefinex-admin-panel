import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [idToEdit, setIdToEdit] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);
  const [modalType, setModalType] = useState(null);
  const closeModal = () => {
    setShowModal(false);
    setIdToEdit(null);
    setDataToEdit(null);
    setIdToDelete(null);
  };
  const openModal = (type = "create", idToBeEditedOrDeleted = null, data = null) => {
    setShowModal(true);
    setModalType(type);

    if (type === "edit") {
      setIdToEdit(idToBeEditedOrDeleted);
      setDataToEdit(data);
    } else if (type === "delete") {
      setIdToDelete(idToBeEditedOrDeleted);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        modalHandler: { close: closeModal, open: openModal, type: modalType, id: idToEdit },
        showModal,
        setShowModal,
        idToEdit,
        setIdToEdit,
        defaultValues: dataToEdit,
        setDataToEdit,
        idToDelete,
        setIdToDelete,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

//This hooks provides the context
//is important to clean the states after close the modal!
export const useModal = () => {
  return useContext(ModalContext);
};
