import React from "react";
import { ModalLayout, ModalHeader, ModalBody, ModalFooter, Typography, Button } from "@strapi/design-system";
import { useModal } from "../../utils/contexts/ModalContext";

export default function CustomModal({ children, handleSubmit }) {
  const { modalHandler } = useModal();

  return (
    <ModalLayout labelledBy="title" as="form">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {modalHandler.type === "edit" ? "Editar entrada" : "Crear entrada"}
        </Typography>
      </ModalHeader>

      <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {children} {/* Render the content within the modal body */}
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={modalHandler.close} variant="tertiary">
            Cancelar
          </Button>
        }
        endActions={<Button onClick={handleSubmit}>{modalHandler.type === "edit" ? "Guardar edición" : "Guardar entrada"}</Button>}
      />
    </ModalLayout>
  );
}
