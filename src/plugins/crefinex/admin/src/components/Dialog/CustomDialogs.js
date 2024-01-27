import React from "react";

import { Typography, Button, Flex, Dialog, DialogBody, DialogFooter } from "@strapi/design-system";

import { ExclamationMarkCircle, Trash, CheckCircle } from "@strapi/icons";
import { useModal } from "../../utils/contexts/ModalContext";
import { useCustomMutation } from "../../utils/hooks/useCustomMutation";
import { query } from "../../utils/graphql/client/GraphQLCLient";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../utils/contexts/AlertContext";
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
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();
  const mutation = useMutation(async (data) => await query(mainAction, { ...data }), {
    onSuccess: () => {
      queryClient.invalidateQueries(section);

      showAlert("success", `${section} eliminada`);
      modalHandler.close();
    },
  });
  const onSubmit = () => {
    mutation.mutate({ id: modalHandler.id });
    modalHandler.close();
  };
  return (
    <Dialog onClose={modalHandler.close} title="Confirmación" isOpen={modalHandler.type === "delete"}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">¿Estás seguro de que deseas eliminar esta lección?</Typography>
          </Flex>
        </Flex>
      </DialogBody>
      <DialogFooter
        startAction={
          <Button onClick={modalHandler.close} variant="tertiary">
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
