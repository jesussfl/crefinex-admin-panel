import React from "react";

import { Typography } from "@strapi/design-system";

import { CheckCircle, ExclamationMarkCircle, Trash } from "@strapi/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";

import { useAlert } from "../../../../utils/contexts/AlertContext";
import { ConfirmationDialog } from "../../../../components/confirmationDialog";
import { deleteLesson, updateLesson } from "../../../../utils/graphql/mutations/lesson.mutations";

export function DeleteDialog() {
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { mutate } = useMutation((data) => query(deleteLesson, data));
  const onSubmit = () => {
    mutate(
      { id: modalHandler.id },
      {
        onSuccess: () => {
          showAlert("success", `Sección eliminada`);
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
    <ConfirmationDialog
      title="Eliminar lección"
      onConfirm={onSubmit}
      onClose={modalHandler.close}
      isOpen={modalHandler.type === "delete"}
      icon={<ExclamationMarkCircle />}
    >
      <Typography id="confirm-description">¿Estás seguro de que deseas eliminar esta lección?</Typography>
    </ConfirmationDialog>
  );
}

export function StatusDialog() {
  const { showAlert } = useAlert();
  const { modalHandler, defaultValues: status } = useModal();
  const queryClient = useQueryClient();
  const { mutate: updateStatus } = useMutation((data) => query(updateLesson, data));
  const onSubmit = () => {
    updateStatus(
      { id: modalHandler.id, data: { status: status === "published" ? "draft" : "published" } },
      {
        onSuccess: () => {
          showAlert("success", `Estado editado`);
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
    <ConfirmationDialog
      title="Cambiar estado"
      onConfirm={onSubmit}
      onClose={modalHandler.close}
      isOpen={modalHandler.type === "status"}
      icon={status === "published" ? <Trash /> : <CheckCircle />}
    >
      <Typography id="confirm-description" textAlign="center">
        {status === "published"
          ? "¿Estás seguro de que deseas despublicar esta lección?"
          : "¿Estás seguro de que deseas publicar esta lección?"}
      </Typography>
    </ConfirmationDialog>
  );
}
