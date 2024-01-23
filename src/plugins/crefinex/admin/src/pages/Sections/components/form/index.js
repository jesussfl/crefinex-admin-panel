import React from "react";
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
import { useModal } from "../../../../utils";
import { Controller, useForm } from "react-hook-form";
import { queryWorlds } from "../../../../utils/graphql/queries/world.queries";
import { query } from "../../../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../../utils/constants/queryKeys.constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Wysiwyg from "../../../../components/Wysiwyg/Wysiwyg";
import { createSection, updateSection } from "../../../../utils/graphql/mutations/section.mutations";

const ORDER_INPUTS_TO_SHOW = 20;
const MAX_DESCRIPTION_LENGTH = 100;
const MAX_WYSIWYG_LENGTH = 1000;
const MIN_DESCRIPTION_LENGTH = 10;
export default function SectionForm({ defaultValues }) {
  const isEditEnabled = !!defaultValues;
  const { mutate } = useMutation(async (data) => await query(isEditEnabled ? updateSection : createSection, { ...data }));
  const { data: worlds, isLoading, error } = useQuery([QUERY_KEYS.worlds], () => query(queryWorlds));
  const { control, handleSubmit } = useForm({ defaultValues });
  const queryClient = useQueryClient();
  const { modalHandler } = useModal();
  const onSubmit = (values) => {
    console.log(values);
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      world: values.world,
      content: values.content,
      contentTitle: values.contentTitle,
      publishedAt: new Date(),
    };
    if (isEditEnabled) {
      console.log("Editando entrada");
      mutate(
        { id: defaultValues.id, ...values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(QUERY_KEYS.sections);
            modalHandler.close();
          },
          onError: (error) => {
            console.log(error);
          },
        }
      );

      return;
    }

    console.log("Creando entrada");
    mutate(
      { data: { ...data } },
      {
        onSuccess: () => {
          console.log("Entrada creada");
          queryClient.invalidateQueries(QUERY_KEYS.sections);
          modalHandler.close();
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };
  return (
    <ModalLayout labelledBy="title" as="form" onSubmit={handleSubmit(onSubmit)} onClose={modalHandler.close}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {isEditEnabled ? "Editar sección" : "Crear sección"}
        </Typography>
      </ModalHeader>

      <ModalBody style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          name={"world"}
          control={control}
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
        <Controller
          name={"contentTitle"}
          control={control}
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
          control={control}
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
