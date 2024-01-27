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
import { Controller, useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { createExercise, updateExercise } from "../../../../utils/graphql/mutations/exercise.mutations";
import { useAlert } from "../../../../utils/contexts/AlertContext";
import SimpleSelectionForm from "./simpleSelectionForm";
import CompletionExerciseForm from "./completionExerciseForm";

// Constants
const ORDER_INPUTS_TO_SHOW = 20;

export default function ExerciseForm({ defaultValues, lessonId }) {
  const isEditEnabled = !!defaultValues; // This variable is used to check if the form is in edit mode

  // Default values have to be parsed in case the form is in edit mode. This is because content is a JSON string
  const parsedDefaultValues = isEditEnabled
    ? {
        ...defaultValues,
        content: JSON.parse(defaultValues.content),
      }
    : {};

  const { showAlert } = useAlert();
  const { modalHandler } = useModal();

  const queryClient = useQueryClient();
  const form = useForm({ defaultValues: parsedDefaultValues });

  const { mutate } = useMutation((data) => query(isEditEnabled ? updateExercise : createExercise, { ...data }));

  const onSubmit = (values) => {
    console.log(values);
    const data = {
      type: values.type,
      order: parseFloat(values.order),
      content: JSON.stringify(values.content),
      lesson: lessonId,
      publishedAt: new Date(),
    };
    if (isEditEnabled) {
      console.log("Editando ejercicio");
      mutate(
        { id: defaultValues.id, data },
        {
          onSuccess: () => {
            console.log("Ejercicio editado");
            showAlert("success", "Ejercicio editado");
            queryClient.invalidateQueries(QUERY_KEYS.exercises);
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
    console.log("Creando ejercicio");
    mutate(
      { data },
      {
        onSuccess: () => {
          console.log("Ejercicio creado");
          showAlert("success", "Ejercicio creado");
          queryClient.invalidateQueries(QUERY_KEYS.exercises);
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

  const renderFieldsBasedOnType = () => {
    if (form.watch("type") === "completion") {
      return <CompletionExerciseForm />;
    } else if (form.watch("type") === "simpleSelection") {
      return <SimpleSelectionForm />;
    }
  };
  return (
    <FormProvider {...form}>
      <ModalLayout labelledBy="title" as="form" onSubmit={form.handleSubmit(onSubmit)} onClose={modalHandler.close}>
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {isEditEnabled ? "Editar sección" : "Crear sección"}
          </Typography>
        </ModalHeader>

        <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Controller
            name={"type"}
            control={form.control}
            rules={{ required: "Este campo es requerido" }}
            render={({ field, fieldState }) => (
              <SingleSelect
                onChange={(event) => {
                  field.onChange(event);

                  // TODO: Add a warning message if the user tries to change the type
                  form.resetField("content");
                }}
                onBlur={(e) => field.onBlur(e.target.value)}
                value={field.value || ""}
                placeholder="Selecciona el tipo de ejercicio"
                label="Tipo de ejercicio"
                error={fieldState.error?.message}
              >
                <SingleSelectOption value="completion">Completar</SingleSelectOption>
                <SingleSelectOption value="wordsMemory">Memoria de palabras</SingleSelectOption>
                <SingleSelectOption value="simpleSelection">Seleccion Simple</SingleSelectOption>
                <SingleSelectOption value="theory">Teoria</SingleSelectOption>
              </SingleSelect>
            )}
          />
          <Controller
            name={"order"}
            control={form.control}
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

          {renderFieldsBasedOnType()}
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
    </FormProvider>
  );
}
