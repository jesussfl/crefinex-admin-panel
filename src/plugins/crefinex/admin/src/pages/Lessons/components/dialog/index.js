import React from "react";

import { Typography, Button, Flex, Dialog, DialogBody, DialogFooter } from "@strapi/design-system";

import { CheckCircle, ExclamationMarkCircle, Trash } from "@strapi/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLesson, updateLesson } from "../../../../utils/graphql/mutations/lesson.mutations";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";

import { useAlert } from "../../../../utils/contexts/AlertContext";

export function DeleteDialog() {
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { mutate } = useMutation((data) => query(deleteLesson, { ...data }));
  const onSubmit = () => {
    mutate(
      { id: modalHandler.id },
      {
        onSuccess: () => {
          showAlert("success", `Lección eliminada`);
          queryClient.invalidateQueries(QUERY_KEYS.lessons);

          modalHandler.close();
        },
        onError: (error) => {
          console.log(error);
          showAlert("error", `Ha ocurrido un error`);
          modalHandler.close();
        },
      }
    );
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

export function StatusDialog({ status }) {
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { mutate: update } = useMutation((data) => query(updateLesson, { ...data }));
  const onSubmit = () => {
    console.log(status);
    update(
      { id: modalHandler.id, data: { status: status === "published" ? "draft" : "published" } },
      {
        onSuccess: () => {
          showAlert("success", `Estado editado`);
          queryClient.invalidateQueries(QUERY_KEYS.sections);

          modalHandler.close();
        },
        onError: (error) => {
          console.log(error);
          showAlert("error", `Ha ocurrido un error`);
          modalHandler.close();
        },
      }
    );
  };
  return (
    <Dialog
      onClose={modalHandler.close}
      title={status === "published" ? "Colocar en borradores" : "Publicar lección"}
      isOpen={modalHandler.type === "status"}
    >
      <DialogBody>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">
              ¿Estás seguro de que deseas {status === "published" ? "colocar en borradores" : "publicar"} esta lección?
            </Typography>
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
          <Button variant={status === "published" ? "danger" : "success"} startIcon={<CheckCircle />} type="submit" onClick={onSubmit}>
            Confirmar
          </Button>
        }
      />
    </Dialog>
  );
}
