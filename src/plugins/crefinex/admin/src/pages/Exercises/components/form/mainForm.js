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
import { Controller, useForm, useFieldArray, FormProvider, useFormState } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { createExercise, updateExercise } from "../../../../utils/graphql/mutations/exercise.mutations";
import { useAlert } from "../../../../utils/contexts/AlertContext";
import SimpleSelectionForm from "./simpleSelectionForm";
import CompletionExerciseForm from "./completionExerciseForm";
import WordMemoryForm from "./wordMemoryForm";
import TheoryExerciseForm from "./theoryExerciseForm";
import { getExercisesByLesson } from "../../../../utils/data/getData";
import { getDirtyValues } from "../../../../utils/helpers/getDirtyValues";

export default function ExerciseForm({ lessonId }) {
  const { modalHandler, defaultValues } = useModal();
  const { showAlert } = useAlert();
  const isEditEnabled = !!defaultValues; // This variable is used to check if the form is in edit mode

  const queryClient = useQueryClient();
  const form = useForm({ defaultValues });
  const { pagination } = getExercisesByLesson(lessonId);
  const { isDirty, dirtyFields } = useFormState({ control: form.control });
  const { mutate: update } = useMutation((data) => query(updateExercise, { ...data }));
  const { mutate: create } = useMutation((data) => query(createExercise, { ...data }));
  const onSubmit = (values) => {
    if (!isEditEnabled) {
      const data = {
        ...values,
        order: parseFloat(pagination?.total + 1),
        lesson: lessonId,
      };

      create(
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
    }
    if (isEditEnabled && isDirty) {
      if (values.id || values.createdAt) {
        values = Object.keys(values)
          .filter((objKey) => objKey !== "id" && objKey !== "createdAt" && objKey !== "updatedAt")
          .reduce((newObj, key) => {
            newObj[key] = values[key];
            return newObj;
          }, {});
      }
      update(
        { id: defaultValues.id, data: values },
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
    }
  };

  const renderFieldsBasedOnType = () => {
    if (form.watch("type") === "completion") {
      return <CompletionExerciseForm />;
    } else if (form.watch("type") === "simpleSelection") {
      return <SimpleSelectionForm />;
    } else if (form.watch("type") === "wordsMemory") {
      return <WordMemoryForm />;
    } else if (form.watch("type") === "theory") {
      return <TheoryExerciseForm />;
    }
    return null;
  };
  return (
    <FormProvider {...form}>
      <ModalLayout labelledBy="title" as="form" onSubmit={form.handleSubmit(onSubmit)} onClose={modalHandler.close}>
        <ModalHeader>
          <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
            {isEditEnabled ? "Editar ejercicio" : "Crear ejercicio"}
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

                  // TODO Add a warning message if the user tries to change the type
                  form.resetField("content");
                  if (isEditEnabled) {
                    form.reset({ ...defaultValues, type: event, content: {} });
                  }
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

          {isEditEnabled && (
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
                  {Array(pagination?.total || 0)
                    .fill(0)
                    .map((_, index) => (
                      <SingleSelectOption key={index} value={index + 1}>
                        {index + 1}
                      </SingleSelectOption>
                    ))}
                </SingleSelect>
              )}
            />
          )}

          {renderFieldsBasedOnType()}
        </ModalBody>

        <ModalFooter
          startActions={
            <Button onClick={modalHandler.close} variant="tertiary">
              Cancelar
            </Button>
          }
          endActions={<Button type="submit">{isEditEnabled ? "Guardar cambios" : "Guardar Ejercicio"}</Button>}
        />
      </ModalLayout>
    </FormProvider>
  );
}
