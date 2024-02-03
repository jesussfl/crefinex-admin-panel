import React from "react";

import { Typography } from "@strapi/design-system";

import { ExclamationMarkCircle } from "@strapi/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";

import { useAlert } from "../../../../utils/contexts/AlertContext";
import { ConfirmationDialog } from "../../../../components/confirmationDialog";
import { deleteExercise } from "../../../../utils/graphql/mutations/exercise.mutations";

export function DeleteDialog() {
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { mutate } = useMutation((data) => query(deleteExercise, data));

  const onSubmit = () => {
    mutate(
      { id: modalHandler.id },
      {
        onSuccess: () => {
          showAlert("success", `Ejercicio eliminado`);
          queryClient.invalidateQueries(QUERY_KEYS.exercises);

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
      title="Eliminar ejercicio"
      onConfirm={onSubmit}
      onClose={modalHandler.close}
      isOpen={modalHandler.type === "delete"}
      icon={<ExclamationMarkCircle />}
    >
      <Typography id="confirm-description">¿Estás seguro de que deseas eliminar este ejercicio?</Typography>
    </ConfirmationDialog>
  );
}
