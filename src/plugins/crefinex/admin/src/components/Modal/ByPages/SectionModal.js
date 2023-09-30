import React from "react";
import CustomModal from "../CustomModal";
import { TextInput, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import { useCustomMutation, useModal } from "../../../utils";

import { useQuery } from "@tanstack/react-query";
import { queryWorlds } from "../../../graphql/queries/world.queries";
import { query } from "../../../graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../constants/queryKeys.constants";

const ORDER_INPUTS_TO_SHOW = 20;

export default function ModuleModal({ mainAction }) {
  // Access modal-related data using the modal hook
  const { idToEdit: editId, setIdToEdit, dataToEdit: defaultValues } = useModal();

  // Use the custom mutation hook to handle data mutations
  const { control, mutate, handleSubmit } = useCustomMutation(QUERY_KEYS.modules, mainAction, defaultValues);

  // Query data about worlds using React Query
  const { data, isLoading, error } = useQuery([QUERY_KEYS.worlds], () => query(queryWorlds));

  // Define the submission function for the form
  const onSubmit = handleSubmit((values) => {
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      world: values.world,
      publishedAt: new Date(),
    };

    // Perform the mutation to create or update a module
    editId ? mutate({ id: editId, data: { ...data } }) : mutate({ data: { ...data } });
  });

  return (
    <CustomModal handleSubmit={onSubmit} setIdToEdit={setIdToEdit}>
      {/* Description input field */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => {
          return (
            <TextInput
              {...field}
              placeholder="Añade la descripción de la sección"
              label="Descripción"
              name="description"
              hint="40 caracteres como máximo"
            />
          );
        }}
      />

      {/* World selection dropdown */}
      {isLoading && !error ? null : (
        <Controller
          name="world"
          control={control}
          render={({ field }) => {
            const { crefinexWorlds } = data;
            return (
              <SingleSelect {...field} placeholder="Selecciona el mundo de la sección" label="Mundo">
                {crefinexWorlds.data.map((world) => (
                  <SingleSelectOption key={world.id} value={world.id}>{`${world.id} - ${world.attributes.name}`}</SingleSelectOption>
                ))}
              </SingleSelect>
            );
          }}
        ></Controller>
      )}

      {/* Order selection dropdown */}
      <Controller
        name="order"
        control={control}
        rules={{ valueAsNumber: true }}
        render={({ field }) => {
          return (
            <SingleSelect label="Orden" placeholder="Selecciona el orden" {...field}>
              {Array(ORDER_INPUTS_TO_SHOW)
                .fill(0)
                .map((_, index) => (
                  <SingleSelectOption key={index} value={index + 1}>
                    {index + 1}
                  </SingleSelectOption>
                ))}
            </SingleSelect>
          );
        }}
      ></Controller>
    </CustomModal>
  );
}
