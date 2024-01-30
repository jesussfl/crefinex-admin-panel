import React from "react";

import { Typography, Button, Flex, Dialog, DialogBody, DialogFooter } from "@strapi/design-system";

import { ExclamationMarkCircle, Trash } from "@strapi/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise } from "../../../../utils/graphql/mutations/exercise.mutations";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";

import { useAlert } from "../../../../utils/contexts/AlertContext";

export function DeleteDialog() {
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { mutate } = useMutation((data) => query(deleteExercise, { ...data }));
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
    <Dialog onClose={modalHandler.close} title="Confirmación" isOpen={modalHandler.type === "delete"}>
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Flex direction="column" alignItems="center" gap={2}>
          <Flex justifyContent="center">
            <Typography id="confirm-description">¿Estás seguro de que deseas eliminar este ejercicio?</Typography>
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
