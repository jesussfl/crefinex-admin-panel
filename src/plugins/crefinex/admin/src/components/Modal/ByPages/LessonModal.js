import React from "react";
import CustomModal from "../CustomModal";
import { TextInput, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import { useCustomMutation, useModal } from "../../../utils/";
import { QUERY_KEYS } from "../../../constants/queryKeys.constants";

const ORDER_INPUTS_TO_SHOW = 20;

export default function LessonModal({ sectionInfo, sectionId, mainAction }) {
  // Access modal-related data using the modal hook
  const { idToEdit, setIdToEdit, dataToEdit: defaultValues } = useModal();

  // Use the custom mutation hook to handle data mutations
  const { control, mutate, handleSubmit } = useCustomMutation(QUERY_KEYS.lessons, mainAction, defaultValues);

  // Define the submission function for the form
  const onSubmit = handleSubmit((values) => {
    // Define the data to be submitted for creating or editing a lesson
    const data = {
      description: values.description,
      order: parseFloat(values.order),
      section: sectionId,
      world: sectionInfo.world.data.id,
      publishedAt: new Date(),
    };

    // Perform the mutation to create or update a lesson
    idToEdit ? mutate({ id: idToEdit, data: { ...data } }) : mutate({ data: { ...data } });
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
              placeholder="Añade una breve descripción de la lección"
              label="Descripción"
              name="description"
              hint="40 caracteres como maximo"
            />
          );
        }}
      />

      {/* Order selection dropdown */}
      <Controller
        name="order"
        control={control}
        render={({ field }) => {
          return (
            <SingleSelect label="Orden" placeholder="Seleccione el orden" {...field}>
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
