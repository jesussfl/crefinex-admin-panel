import React, { forwardRef } from "react";
import CustomModal from "../CustomModal";
import { TextInput, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../utils/";
import { QUERY_KEYS } from "../../../utils/constants/queryKeys.constants";
import { useAlert } from "../../../utils/contexts/AlertContext";
import { query } from "../../../utils/graphql/client/GraphQLCLient";

const ORDER_INPUTS_TO_SHOW = 20;
const MAX_DESCRIPTION_LENGTH = 40; // Max description length

export default function LessonModal({ sectionInfo, sectionId, mainAction }) {
  const { defaultValues, modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm({ defaultValues });
  const { showAlert } = useAlert();
  const mutation = useMutation(async (data) => await query(mainAction, { ...data }), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.lessons);

      modalHandler.type === "edit" ? showAlert("success", "Lección editada") : showAlert("success", "Lección creada");
      modalHandler.close();
    },
  });
  const onSubmit = handleSubmit((values) => {
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      section: sectionId,
      world: sectionInfo.world.data.id,
      publishedAt: new Date(),
      type: values.type,
    };
    if (modalHandler.type === "edit") {
      const editMutationData = {
        id: modalHandler.id,
        data: { ...data },
      };
      mutation.mutate(editMutationData);
    } else {
      const createMutationData = { data: { ...data } };
      mutation.mutate(createMutationData);
    }
    modalHandler.close();
  });

  return (
    <CustomModal handleSubmit={onSubmit}>
      <SingleSelectControlled
        name="type"
        control={control}
        rules={{ required: "Este campo es obligatorio" }}
        placeholder="Selecciona el tipo de lección"
        label="Tipo de lección"
      >
        <SingleSelectOption value="gift">Regalo</SingleSelectOption>
        <SingleSelectOption value="lesson">Lección</SingleSelectOption>
        <SingleSelectOption value="exam">Examen</SingleSelectOption>
      </SingleSelectControlled>
      {/* Description input field */}
      <TextInputControlled
        name="description"
        control={control}
        rules={{
          required: "Este campo es obligatorio",
          maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Máximo ${MAX_DESCRIPTION_LENGTH} caracteres` },
          minLength: { value: 2, message: "Mínimo 2 caracteres" },
          pattern: { value: /^[a-zA-Z0-9\s]+$/, message: "Solo letras y números" },
        }}
        placeholder="Añade una breve descripción de la lección"
        label="Descripción"
        hint={`${MAX_DESCRIPTION_LENGTH} caracteres como máximo`}
      />

      {/* Order selection dropdown */}
      <SingleSelectControlled
        name="order"
        control={control}
        rules={{ required: "Este campo es obligatorio" }}
        placeholder="Seleccione el orden"
        label="Orden"
      >
        {Array(ORDER_INPUTS_TO_SHOW)
          .fill(0)
          .map((_, index) => (
            <SingleSelectOption key={index} value={index + 1}>
              {index + 1}
            </SingleSelectOption>
          ))}
      </SingleSelectControlled>
    </CustomModal>
  );
}
const TextInputControlled = forwardRef(({ name, control, rules, placeholder, label, hint }, ref) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextInput {...field} ref={ref} placeholder={placeholder} label={label} hint={hint} error={fieldState.error?.message} />
      )}
    />
  );
});

const SingleSelectControlled = forwardRef(({ name, control, rules, label, placeholder, children }, ref) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <SingleSelect {...field} ref={ref} placeholder={placeholder} label={label} error={fieldState.error?.message}>
          {children}
        </SingleSelect>
      )}
    />
  );
});
