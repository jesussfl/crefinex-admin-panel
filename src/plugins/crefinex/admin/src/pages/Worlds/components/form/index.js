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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useFormState } from "react-hook-form";
import { useModal } from "../../../../utils";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { createWorld, updateWorld } from "../../../../utils/graphql/mutations/world.mutations";
import { getDirtyValues } from "../../../../utils/helpers/getDirtyValues";
import { useAlert } from "../../../../utils/contexts/AlertContext";
import { getWorlds } from "../../../../utils/data/getData";
import { useAssetsDialog } from "../../../../utils/hooks/useAssetsDialog";
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_DESCRIPTION_LENGTH = 10;

export default function WorldsForm() {
  // Utilities

  const { modalHandler, defaultValues } = useModal();
  const { showAlert } = useAlert();

  // This is used to know if the form is in edit mode
  const isEditEnabled = !!defaultValues;

  // Form management
  const form = useForm({ defaultValues });
  const { isDirty, dirtyFields } = useFormState({ control: form.control });
  const { AssetsDialog, isAssetsDialogOpen, toggleAssetsDialog } = useAssetsDialog();
  const selectAssets = (files) => {
    const formattedFiles = files;
    if (formattedFiles.length > 1) {
      return;
    }

    form.setValue(`image`, formattedFiles[0].id, {
      shouldDirty: true,
    });

    toggleAssetsDialog();
  };
  // Data management
  const queryClient = useQueryClient();
  const { pagination } = getWorlds();
  const { mutate: create } = useMutation((data) => query(createWorld, data));
  const { mutate: update } = useMutation((data) => query(updateWorld, data));

  const onSubmit = (values) => {
    if (!isEditEnabled) {
      const data = {
        ...values,
        order: parseFloat(pagination?.total + 1),
      };

      create(
        { data },
        {
          onSuccess: () => {
            showAlert("success", `Mundo creado`);
            queryClient.invalidateQueries(QUERY_KEYS.worlds);
            modalHandler.close();
          },
          onError: (error) => {
            showAlert("error", `Ha ocurrido un error`);
            console.log(error);
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
            showAlert("success", `Mundo editado`);
            queryClient.invalidateQueries(QUERY_KEYS.sections);
            modalHandler.close();
          },
          onError: (error) => {
            showAlert("error", `Ha ocurrido un error`);
            console.log(error);
          },
        }
      );
      return;
    }
  };

  return (
    <ModalLayout labelledBy="title" as="form" onSubmit={form.handleSubmit(onSubmit)} onClose={modalHandler.close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {isEditEnabled ? "Editar Mundo" : "Crear Mundo"}
        </Typography>
      </ModalHeader>

      <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <Controller
          name={"name"}
          control={form.control}
          rules={{
            required: "Este campo es requerido",
            maxLength: {
              value: 50,
              message: `El nombre debe tener como máximo 50 carácteres`,
            },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              label={"Nombre"}
              error={fieldState.error?.message}
              hint={"Max. 50 carácteres"}
            />
          )}
        />
        <Controller
          name={"description"}
          control={form.control}
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
              hint={`${MAX_DESCRIPTION_LENGTH} carácteres máximo`}
              error={fieldState.error?.message}
            />
          )}
        />
        {form.watch(`image`) ? (
          <Typography style={{ fontSize: "12px" }}>Imagen Añadida: {form.watch(`image`)}</Typography>
        ) : (
          <Typography style={{ fontSize: "12px" }}>Sin imagen</Typography>
        )}
        <Button
          onClick={() => {
            toggleAssetsDialog();
          }}
        >
          {form.watch(`image`) ? "Cambiar imagen" : "Anadir imagen"}
        </Button>
        {isEditEnabled && (
          <Controller
            name={"order"}
            control={form.control}
            rules={{ required: "Este campo es requerido" }}
            render={({ field, fieldState }) => (
              <SingleSelect {...field} placeholder="Selecciona el orden" label="Orden" error={fieldState.error?.message}>
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

        <Controller
          name={"status"}
          control={form.control}
          rules={{ required: "Este campo es requerido" }}
          render={({ field, fieldState }) => (
            <SingleSelect {...field} placeholder="Selecciona el estado" label="Estado" error={fieldState.error?.message}>
              <SingleSelectOption value={"draft"}>En borrador</SingleSelectOption>
              <SingleSelectOption value={"published"}>Publicado</SingleSelectOption>
              <SingleSelectOption value={"archive"}>Archivado</SingleSelectOption>
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
        endActions={<Button type="submit">{isEditEnabled ? "Guardar cambios" : "Guardar Mundo"}</Button>}
      />
      {isAssetsDialogOpen && <AssetsDialog onClose={toggleAssetsDialog} onSelectAssets={selectAssets} />}
    </ModalLayout>
  );
}
