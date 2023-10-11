import React, { forwardRef, useState } from "react";
import CustomModal from "../CustomModal";
import { Button, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import SimpleSelectionExercise from "../Exercises/SimpleSelectionExercise";
import CompletionExercise from "../Exercises/CompletionExercise";
import WordMemoryExercise from "../Exercises/WordMemoryExercise";
import { useCustomMutation, useModal } from "../../../utils";
import { QUERY_KEYS } from "../../../constants/queryKeys.constants";

const ORDER_INPUTS_TO_SHOW = 20;
const MAX_EXERCISE_ORDER = 100;

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

export default function ExercisesModal({ lessonId, mainAction, defaultValues }) {
  const { control, mutate, handleSubmit, watch } = useCustomMutation(QUERY_KEYS.exercises, mainAction, defaultValues);
  const { idToEdit } = useModal();
  const [exerciseContent, setExerciseContent] = useState({});
  const renderExerciseFields = () => {
    if (watch("type") === "completion") {
      return <CompletionExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    } else if (watch("type") === "wordsMemory") {
      return <WordMemoryExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    } else if (watch("type") === "simpleSelection") {
      return <SimpleSelectionExercise onContentChange={(content) => setExerciseContent(content)} />;
    }
    return null;
  };

  const onSubmit = handleSubmit((data) => {
    const exercise = {
      data: {
        lesson: lessonId,
        content: JSON.stringify({ exerciseContent }),
        type: data.type,
        order: parseFloat(data.order),
        publishedAt: new Date(),
      },
    };

    idToEdit ? mutate({ id: idToEdit, data: { ...exercise } }) : mutate({ ...exercise });
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
