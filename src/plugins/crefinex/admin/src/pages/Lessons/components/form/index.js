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
import { Controller, useForm, useFormState } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { createLesson, updateLesson } from "../../../../utils/graphql/mutations/lesson.mutations";
import { useAlert } from "../../../../utils/contexts/AlertContext";
import { getLessonsBySection } from "../../../../utils/data/getData";
import { getDirtyValues } from "../../../../utils/helpers/getDirtyValues";

// Constants
const MAX_DESCRIPTION_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 10;

export default function LessonForm({ sectionId }) {
  const { showAlert } = useAlert();
  const { modalHandler, defaultValues } = useModal();

  const isEditEnabled = !!defaultValues; // This variable is used to check if the form is in edit mode

  const queryClient = useQueryClient();
  const { pagination } = getLessonsBySection(sectionId);
  const { control, handleSubmit } = useForm({ defaultValues });
  const { isDirty, dirtyFields } = useFormState({ control });
  const { mutate: create } = useMutation((data) => query(createLesson, { ...data }));
  const { mutate: update } = useMutation((data) => query(updateLesson, { ...data }));

  const onSubmit = (values) => {
    if (!isEditEnabled) {
      const data = {
        ...values,
        order: parseFloat(pagination?.total + 1),
        section: sectionId,
      };
      create(
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
    }

    if (isEditEnabled && isDirty) {
      const data = getDirtyValues(dirtyFields, values); // Get only the fields that have been changed

      update(
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

        {isEditEnabled && (
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
