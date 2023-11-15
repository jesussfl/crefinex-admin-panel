import React, { forwardRef, useState, useEffect } from "react";
import CustomModal from "../CustomModal";
import { Button, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SimpleSelectionExercise from "../Exercises/SimpleSelectionExercise";
import CompletionExercise from "../Exercises/CompletionExercise";
import WordMemoryExercise from "../Exercises/WordMemoryExercise";
import TheoryExercise from "../Exercises/TheoryExercise";
import { useModal } from "../../../utils";
import { QUERY_KEYS } from "../../../utils/constants/queryKeys.constants";
import { useAlerts } from "../../../utils/contexts/AlertsContext";
import { query } from "../../../utils/graphql/client/GraphQLCLient";
const ORDER_INPUTS_TO_SHOW = 20;
const MAX_EXERCISE_ORDER = 100;

export default function ExercisesModal({ lessonId, mainAction }) {
  const { defaultValues, modalHandler } = useModal();
  const queryClient = useQueryClient();
  const { control, handleSubmit, watch } = useForm({ defaultValues });
  const { showAlert } = useAlerts();
  const mutation = useMutation(async (data) => await query(mainAction, { ...data }), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.exercises);

      modalHandler.type === "edit" ? showAlert("success", "Lección editada") : showAlert("success", "Lección creada");
      modalHandler.close();
    },
  });
  const [exerciseContent, setExerciseContent] = useState({});
  const renderExerciseFields = () => {
    if (watch("type") === "completion") {
      return <CompletionExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    } else if (watch("type") === "wordsMemory") {
      return <WordMemoryExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    } else if (watch("type") === "simpleSelection") {
      return <SimpleSelectionExercise onContentChange={(content) => setExerciseContent(content)} />;
    } else if (watch("type") === "theory") {
      return <TheoryExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    }
    return null;
  };
  console.log("exerciseContent", exerciseContent);
  useEffect(() => {
    setExerciseContent({});
  }, [watch("type")]);
  const onSubmit = handleSubmit((data) => {
    const exercise = {
      data: {
        lesson: lessonId,
        content: JSON.stringify(exerciseContent),
        type: data.type,
        order: parseFloat(data.order),
        publishedAt: new Date(),
      },
    };
    if (modalHandler.type === "edit") {
      const editMutationData = {
        id: modalHandler.id,
        data: { ...exercise },
      };
      mutation.mutate(editMutationData);
    } else {
      const createMutationData = {
        ...exercise,
      };
      mutation.mutate(createMutationData);
    }

    modalHandler.close();

    // idToEdit ? mutate({ id: idToEdit, data: { ...exercise } }) : mutate({ ...exercise });
  });

  return (
    <CustomModal handleSubmit={onSubmit}>
      <SingleSelectControlled
        name="type"
        control={control}
        rules={{ required: "Este campo es obligatorio" }}
        placeholder="Selecciona el tipo de ejercicio"
        label="Tipo de ejercicio"
      >
        <SingleSelectOption value="completion">Completar</SingleSelectOption>
        <SingleSelectOption value="wordsMemory">Memoria de palabras</SingleSelectOption>
        <SingleSelectOption value="simpleSelection">Seleccion Simple</SingleSelectOption>
        <SingleSelectOption value="theory">Teoria</SingleSelectOption>
      </SingleSelectControlled>

      <SingleSelectControlled
        name="order"
        control={control}
        rules={{
          required: "Este campo es obligatorio",
          min: { value: 1, message: "El orden debe ser mayor o igual a 1" },
          max: { value: MAX_EXERCISE_ORDER, message: `Máximo ${MAX_EXERCISE_ORDER}` },
        }}
        placeholder="Selecciona el orden del ejercicio"
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

      {renderExerciseFields()}
    </CustomModal>
  );
}
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
