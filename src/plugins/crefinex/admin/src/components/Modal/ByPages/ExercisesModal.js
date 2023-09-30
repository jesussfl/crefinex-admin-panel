// ExercisesModal.js
import React, { useState, useEffect } from "react";
import CustomModal from "../CustomModal";
import { Button, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import SimpleSelectionExercise from "../SimpleSelectionExercise";
import CompletionExercise from "../CompletionExercise";
import WordMemoryExercise from "../WordMemoryExercise";
import { useCustomMutation, useModal } from "../../../utils";
import { QUERY_KEYS } from "../../../constants/queryKeys.constants";

const ORDER_INPUTS_TO_SHOW = 20;

export default function ExercisesModal({ lessonId, mainAction, defaultValues }) {
  const { control, mutate, handleSubmit, watch } = useCustomMutation(QUERY_KEYS.exercises, mainAction, defaultValues);
  const { idToEdit } = useModal();
  const [exerciseContent, setExerciseContent] = useState({}); // Initialize exerciseContent state
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

    idToEdit ? mutate({ id: idToEdit, data: { ...exercise } }) : mutate({ ...exercise });
  });

  const renderExerciseFields = () => {
    if (watch("type") === "completion") {
      return <CompletionExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    } else if (watch("type") === "wordsMemory") {
      return <WordMemoryExercise control={control} onContentChange={setExerciseContent} exerciseContent={exerciseContent} />;
    } else if (watch("type") === "simpleSelection") {
      return (
        <SimpleSelectionExercise
          onContentChange={(content) => setExerciseContent(content)} // Pass the callback to update exerciseContent
        />
      );
    }
    return null;
  };

  return (
    <CustomModal handleSubmit={onSubmit}>
      <Controller
        name="type"
        control={control}
        render={({ field }) => {
          return (
            <SingleSelect {...field} placeholder="Selecciona el tipo del ejercicio">
              <SingleSelectOption value="completion">Completar</SingleSelectOption>
              <SingleSelectOption value="wordsMemory">Memoria de Palabras</SingleSelectOption>
              <SingleSelectOption value="simpleSelection">Seleccion Simple</SingleSelectOption>
            </SingleSelect>
          );
        }}
      ></Controller>
      <Controller
        name="order"
        control={control}
        render={({ field }) => {
          return (
            <SingleSelect label="Order" placeholder="Select" {...field}>
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

      {renderExerciseFields()}
    </CustomModal>
  );
}
