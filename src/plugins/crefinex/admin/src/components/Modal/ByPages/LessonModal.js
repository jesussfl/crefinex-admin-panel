import React, { forwardRef } from "react";
import CustomModal from "../CustomModal";
import { TextInput, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import { useCustomMutation, useModal } from "../../../utils/";
import { QUERY_KEYS } from "../../../utils/constants/queryKeys.constants";

const ORDER_INPUTS_TO_SHOW = 20;
const MAX_DESCRIPTION_LENGTH = 40; // Max description length

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

export default function LessonModal({ sectionInfo, sectionId, mainAction }) {
  const { idToEdit, setIdToEdit, dataToEdit: defaultValues, setDataToEdit, setShowModal } = useModal();
  const { control, mutate, handleSubmit } = useCustomMutation(QUERY_KEYS.lessons, mainAction, defaultValues);

  const onSubmit = handleSubmit((values) => {
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      section: sectionId,
      world: sectionInfo.world.data.id,
      publishedAt: new Date(),
    };

    idToEdit ? mutate({ id: idToEdit, data: { ...data } }) : mutate({ data: { ...data } });

    setIdToEdit(null);
    setShowModal(false);
    setDataToEdit(null);
  });

  return (
    <CustomModal handleSubmit={onSubmit} setIdToEdit={setIdToEdit}>
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
