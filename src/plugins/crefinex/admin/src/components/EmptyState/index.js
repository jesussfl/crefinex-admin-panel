import React from "react";
import { Illo } from "../../components/Illo";
import { EmptyStateLayout, Button } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { useModal } from "../../utils/contexts/ModalContext";
export default function EmptyState({ message, renderActionModal }) {
  const { modalHandler } = useModal();
  return (
    <>
      <EmptyStateLayout
        icon={<Illo />}
        content={message}
        action={
          <Button onClick={() => modalHandler.open("create")} variant="secondary" startIcon={<Plus />}>
            Crear entrada
          </Button>
        }
      />
      {modalHandler.type === "create" && renderActionModal()}
    </>
  );
}
