import React, { forwardRef, useState } from "react";
import CustomModal from "../CustomModal";
import { TextInput, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import { useCustomMutation, useModal } from "../../../utils";

import { useQuery } from "@tanstack/react-query";
import { queryWorlds } from "../../../graphql/queries/world.queries";
import { query } from "../../../graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../../constants/queryKeys.constants";

const ORDER_INPUTS_TO_SHOW = 20;
const MAX_DESCRIPTION_LENGTH = 100;
export default function ModuleModal({ mainAction }) {
  // Access modal-related data using the modal hook
  const { idToEdit: editId, setIdToEdit, dataToEdit: defaultValues, setDataToEdit, setShowModal } = useModal();

  // Use the custom mutation hook to handle data mutations
  const { control, mutate, handleSubmit, errors } = useCustomMutation(QUERY_KEYS.modules, mainAction, defaultValues);

  // Query data about worlds using React Query
  const { data, isLoading, error } = useQuery([QUERY_KEYS.worlds], () => query(queryWorlds));

  // Define the submission function for the form
  const onSubmit = handleSubmit((values) => {
    // Define the data to be submitted for creating or editing a module
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      world: values.world,
      publishedAt: new Date(),
    };

    editId ? mutate({ id: editId, data: { ...data } }) : mutate({ data: { ...data } });
    setDataToEdit(null);
    setIdToEdit(null);
    setShowModal(false);
  });

  return (
    <CustomModal handleSubmit={onSubmit} setIdToEdit={setIdToEdit}>
      <TextInputControlled
        name="description"
        control={control}
        rules={{
          required: "Este campo es obligatorio",
          maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Máximo ${MAX_DESCRIPTION_LENGTH} caracteres` },
          minLength: { value: 2, message: "Mínimo 2 caracteres" },
          pattern: { value: /^[a-zA-Z0-9\s]+$/, message: "Solo letras y números" },
        }}
      />
      {isLoading && !error ? null : (
        <SingleSelectControlled
          name="world"
          control={control}
          rules={{ required: "Este campo es obligatorio" }}
          data={data?.crefinexWorlds?.data}
        />
      )}

      {/* Order selection dropdown */}
      <OrderSelectionControlled name="order" control={control} rules={{ required: "Este campo es obligatorio" }} />
    </CustomModal>
  );
}

const TextInputControlled = forwardRef(({ name, control, rules }, ref) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur }, fieldState }) => (
        <TextInput
          onChange={(e) => {
            const newValue = e.target.value;
            // Verificar la longitud del valor y truncarlo si es necesario
            if (newValue.length <= MAX_DESCRIPTION_LENGTH) {
              setInputValue(newValue);
              onChange(newValue);
            }
          }}
          onBlur={onBlur}
          value={inputValue || ""}
          ref={ref}
          placeholder="Añade la descripción de la sección"
          label="Descripción"
          hint={`${MAX_DESCRIPTION_LENGTH} caracteres como máximo`}
          error={fieldState.error?.message}
        />
      )}
    />
  );
});

const SingleSelectControlled = forwardRef(({ name, control, rules, data }, ref) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState }) => (
      <SingleSelect
        onChange={onChange}
        onBlur={onBlur}
        value={value || ""}
        ref={ref}
        placeholder="Selecciona el mundo de la sección"
        label="Mundo"
        error={fieldState.error?.message}
      >
        {data.map((world) => (
          <SingleSelectOption key={world.id} value={world.id}>{`${world.id} - ${world.attributes.name}`}</SingleSelectOption>
        ))}
      </SingleSelect>
    )}
  />
));

const OrderSelectionControlled = forwardRef(({ name, control, rules }, ref) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState }) => (
      <SingleSelect
        onChange={onChange}
        onBlur={onBlur}
        value={value || ""}
        ref={ref}
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
));
