import React from "react";

import { Typography, Button, Flex, Dialog, DialogBody, DialogFooter } from "@strapi/design-system";

import { ExclamationMarkCircle, Trash, CheckCircle } from "@strapi/icons";
import { useModal } from "../../utils/contexts/ModalContext";
import { useCustomMutation } from "../../utils/hooks/useCustomMutation";

// Confirmation dialog component
export function ConfirmationDialog({ setShowDialog, setShowModal, handleSubmit }) {
  return (
    <Dialog onClose={() => setShowDialog(false)} title="Confirmación" isOpen={setShowDialog}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">¿Estás seguro de que deseas crear esta lección?</Typography>
          </Flex>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={() => setShowDialog(false)} variant="tertiary">
            Cancelar
          </Button>
        }
        endAction={
          <Button
            variant="success-light"
            startIcon={<CheckCircle />}
            type="submit"
            onClick={() => {
              handleSubmit();
              setShowModal(false);
            }}
          >
            Confirmar
          </Button>
        }
      />
    </Dialog>
  );
}

// Delete dialog component
export function DeleteDialog({ mainAction, section }) {
  const { mutate } = useCustomMutation(section, mainAction);
  const { setIdToDelete: showDialog, idToDelete } = useModal();
  const onSubmit = () => {
    mutate({ id: idToDelete });
    showDialog(null);
  };
  return (
    <Dialog onClose={() => showDialog(null)} title="Confirmación" isOpen={showDialog !== null}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">¿Estás seguro de que deseas eliminar esta lección?</Typography>
          </Flex>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={() => showDialog(null)} variant="tertiary">
            Cancelar
          </Button>
        }
        endAction={
          <Button variant="danger" startIcon={<Trash />} type="submit" onClick={onSubmit}>
            Confirmar
          </Button>
        }
      />
    </Dialog>
  );
}
