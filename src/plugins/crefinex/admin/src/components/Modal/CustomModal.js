import React from "react";
import { ModalLayout, ModalHeader, ModalBody, ModalFooter, Typography, Button } from "@strapi/design-system";
import { useModal } from "../../utils/contexts/ModalContext";

export default function CustomModal({ children, handleSubmit }) {
  // Access modal-related data using the modal hook
  const { setShowModal, setIdToEdit, setDataToEdit, idToEdit } = useModal();

  return (
    <ModalLayout
      onClose={() => {
        // Close the modal and reset editing data when the modal is closed
        setIdToEdit(null);
        setDataToEdit(null);
        setShowModal(false);
      }}
      labelledBy="title"
      as="form"
    >
      <ModalHeader>
        {/* Display the title based on whether it's an edit or add operation */}
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {idToEdit ? "Edición de entrada" : "Adición de entrada"}
        </Typography>
      </ModalHeader>

      <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {children} {/* Render the content within the modal body */}
      </ModalBody>

      <ModalFooter
        startActions={
          <Button
            onClick={() => {
              // Cancel button action: Reset editing data and close the modal
              setIdToEdit(null);
              setDataToEdit(null);
              setShowModal(false);
            }}
            variant="tertiary"
          >
            Cancelar
          </Button>
        }
        endActions={
          <Button onClick={handleSubmit}>
            {/* Submit button label based on whether it's an edit or add operation */}
            {idToEdit ? "Guardar edición" : "Guardar entrada"}
          </Button>
        }
      />
    </ModalLayout>
  );
}
