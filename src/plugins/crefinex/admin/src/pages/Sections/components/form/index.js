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
import Wysiwyg from "../../../../components/Wysiwyg/Wysiwyg";

// Hooks and utilities
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useFormState } from "react-hook-form";
import { useModal } from "../../../../utils";
import { queryWorlds } from "../../../../utils/graphql/queries/world.queries";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { createSection, updateSection } from "../../../../utils/graphql/mutations/section.mutations";
import { getDirtyValues } from "../../../../utils/helpers/getDirtyValues";
import { useAlert } from "../../../../utils/contexts/AlertContext";
import { getSections } from "../../../../utils/data/getData";
import { CustomAlert, Loader } from "../../../../components";

const MAX_DESCRIPTION_LENGTH = 100;
const MAX_WYSIWYG_LENGTH = 1000;
const MIN_DESCRIPTION_LENGTH = 10;

export default function SectionForm() {
  // Utilities
  const { modalHandler, defaultValues } = useModal();
  const { showAlert } = useAlert();

  // This is used to know if the form is in edit mode
  const isEditEnabled = !!defaultValues;

  // Form management
  const form = useForm({ defaultValues });
  const { isDirty, dirtyFields } = useFormState({ control: form.control });

  // Data management
  const queryClient = useQueryClient();
  const { data: worlds, isLoading, error } = useQuery([QUERY_KEYS.worlds], () => query(queryWorlds));
  const { pagination } = getSections();
  const { mutate: create } = useMutation((data) => query(createSection, data));
  const { mutate: update } = useMutation((data) => query(updateSection, data));

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
            console.log("Entrada creada");
            showAlert("success", `Sección creada`);
            queryClient.invalidateQueries(QUERY_KEYS.sections);
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
            console.log("Sección editada");
            showAlert("success", `Sección editada`);
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

  if (isLoading && !worlds) return <Loader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  return (
    <ModalLayout labelledBy="title" as="form" onSubmit={form.handleSubmit(onSubmit)} onClose={modalHandler.close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {isEditEnabled ? "Editar sección" : "Crear sección"}
        </Typography>
      </ModalHeader>

      <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
              hint={`${MAX_DESCRIPTION_LENGTH} carácteres como máximo`}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={"world"}
          control={form.control}
          rules={{ required: "Este campo es requerido" }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <SingleSelect
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              placeholder="Selecciona el mundo de la sección"
              label="Mundo"
              error={fieldState.error?.message}
            >
              {!isLoading &&
                worlds.crefinexWorlds.data.map((world) => (
                  <SingleSelectOption key={world.id} value={world.id}>{`${world.id} - ${world.attributes.name}`}</SingleSelectOption>
                ))}
            </SingleSelect>
          )}
        />
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
          name={"contentTitle"}
          control={form.control}
          rules={{
            required: "Este campo es requerido",
          }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              onChange={onChange}
              onBlur={onBlur}
              value={value || ""}
              label={"Título del contenido"}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={"content"}
          control={form.control}
          rules={{
            required: "Este campo es obligatorio",
            maxLength: { value: MAX_WYSIWYG_LENGTH, message: `Máximo ${MAX_WYSIWYG_LENGTH} caracteres` },
            minLength: { value: 100, message: "El contenido es muy corto" },
          }}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <Wysiwyg
              name={"content"}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              displayName={"Contenido de la sección"}
              error={fieldState.error?.message}
            />
          )}
        />
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
        endActions={<Button type="submit">{isEditEnabled ? "Guardar cambios" : "Guardar sección"}</Button>}
      />
    </ModalLayout>
  );
}
