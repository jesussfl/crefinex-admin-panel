import React from "react";

// Components
import {
  TextInput,
  SingleSelect,
  SingleSelectOption,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
} from "@strapi/design-system";

// Hooks and utilities
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { createLesson, updateLesson } from "../../../../utils/graphql/mutations/lesson.mutations";
import { useAlert } from "../../../../utils/contexts/AlertContext";

// Constants
const ORDER_INPUTS_TO_SHOW = 20;
const MAX_DESCRIPTION_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 10;

export default function LessonForm({ defaultValues, sectionId }) {
  const isEditEnabled = !!defaultValues; // This variable is used to check if the form is in edit mode
  console.log("isEditEnabled", isEditEnabled);
  const { showAlert } = useAlert();
  const { modalHandler } = useModal();

  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm({ defaultValues });
  const { mutate } = useMutation((data) => query(isEditEnabled ? updateLesson : createLesson, { ...data }));

  const onSubmit = (values) => {
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      section: sectionId,
      type: values.type,
      publishedAt: new Date(),
    };
    if (isEditEnabled) {
      console.log("Editando leccion");
      mutate(
        { id: defaultValues.id, data },
        {
          onSuccess: () => {
            console.log("Lección editada");
            showAlert("success", "Lección editada");
            queryClient.invalidateQueries(QUERY_KEYS.lessons);
            modalHandler.close();
          },
          onError: (error) => {
            console.log(error);
            showAlert("error", "Ha ocurrido un error");
            modalHandler.close();
          },
        }
      );

      return;
    }

    console.log("Creando lección");
    mutate(
      { data },
      {
        onSuccess: () => {
          console.log("Lección creada");
          showAlert("success", "Lección creada");
          queryClient.invalidateQueries(QUERY_KEYS.lessons);
          modalHandler.close();
        },
        onError: (error) => {
          console.log(error);
          showAlert("error", "Ha ocurrido un error");
          modalHandler.close();
        },
      }
    );
  };
  return (
    <ModalLayout labelledBy="title" as="form" onSubmit={handleSubmit(onSubmit)} onClose={modalHandler.close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {isEditEnabled ? "Editar lección" : "Crear lección"}
        </Typography>
      </ModalHeader>

      <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Controller
          name={"type"}
          control={control}
          rules={{ required: "Este campo es requerido" }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <SingleSelect
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              placeholder="Selecciona el tipo"
              label="Tipo de lección"
              error={fieldState.error?.message}
            >
              <SingleSelectOption value="gift">Regalo</SingleSelectOption>
              <SingleSelectOption value="lesson">Lección</SingleSelectOption>
              <SingleSelectOption value="exam">Examen</SingleSelectOption>
            </SingleSelect>
          )}
        />
        <Controller
          name={"description"}
          control={control}
          rules={{
            required: "Este campo es requerido",
            maxLength: {
              value: MAX_DESCRIPTION_LENGTH,
              message: `La descripción debe tener como máximo ${MAX_DESCRIPTION_LENGTH} carácteres`,
            },
            minLength: {
              value: MIN_DESCRIPTION_LENGTH,
              message: `La descripción debe tener como mínimo ${MIN_DESCRIPTION_LENGTH} carácteres`,
            },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              label={"Descripción"}
              hint={`${MAX_DESCRIPTION_LENGTH} carácteres como máximo`}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name={"order"}
          control={control}
          rules={{ required: "Este campo es requerido" }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <SingleSelect
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              placeholder="Selecciona el orden"
              label="Orden"
              error={fieldState.error?.message}
            >
              {Array(ORDER_INPUTS_TO_SHOW)
                .fill(0)
                .map((_, index) => (
                  <SingleSelectOption key={index} value={index + 1}>
                    {index + 1}
                  </SingleSelectOption>
                ))}
            </SingleSelect>
          )}
        />
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={modalHandler.close} variant="tertiary">
            Cancelar
          </Button>
        }
        endActions={<Button type="submit">{isEditEnabled ? "Guardar cambios" : "Guardar Lección"}</Button>}
      />
    </ModalLayout>
  );
}
