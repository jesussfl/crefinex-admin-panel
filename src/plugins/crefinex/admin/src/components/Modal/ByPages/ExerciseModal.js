// ExercisesModal.js
import React, { useState, useEffect } from "react";
import CustomModal from "../CustomModal";
import { Button, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";
import SimpleSelectionExercise from "../Exercises/SimpleSelectionExercise";
import CompletionExercise from "../Exercises/CompletionExercise";
import WordMemoryExercise from "../Exercises/WordMemoryExercise";
import { useCustomMutation, useModal } from "../../../utils";
import { QUERY_KEYS } from "../../../constants/queryKeys.constants";

// Define the number of order inputs to show
const ORDER_INPUTS_TO_SHOW = 20;

export default function ExercisesModal({ lessonId, mainAction, defaultValues }) {
  // Use custom mutation hook to handle data mutations
  const { control, mutate, handleSubmit, watch } = useCustomMutation(QUERY_KEYS.exercises, mainAction, defaultValues);

  // Use the modal hook to access modal-related data
  const { idToEdit } = useModal();

  // Initialize state to store exercise content
  const [exerciseContent, setExerciseContent] = useState({});

  // Reset exercise content when the exercise type changes
  useEffect(() => {
    setExerciseContent({});
  }, [watch("type")]);

  // Handle form submission
  const onSubmit = handleSubmit((data) => {
    // Create an exercise object with the provided data
    const exercise = {
      data: {
        lesson: lessonId,
        content: JSON.stringify(exerciseContent),
        type: data.type,
        order: parseFloat(data.order),
        publishedAt: new Date(),
      },
    };

    // Mutate (update or create) the exercise using the custom mutation hook
    idToEdit ? mutate({ id: idToEdit, data: { ...exercise } }) : mutate({ ...exercise });
  });

  // Render the specific exercise fields based on the selected exercise type
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
      {/* Exercise type selection dropdown */}
      <Controller
        name="type"
        control={control}
        render={({ field }) => {
          return (
            <SingleSelect {...field} placeholder="Selecciona el tipo de ejercicio">
              <SingleSelectOption value="completion">Completar</SingleSelectOption>
              <SingleSelectOption value="wordsMemory">Memoria de palabras</SingleSelectOption>
              <SingleSelectOption value="simpleSelection">Seleccion Simple</SingleSelectOption>
            </SingleSelect>
          );
        }}
      ></Controller>

      {/* Exercise order selection dropdown */}
      <Controller
        name="order"
        control={control}
        render={({ field }) => {
          return (
            <SingleSelect label="Orden" placeholder="Selecciona el orden del ejercicio" {...field}>
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

      {/* Render exercise-specific fields based on the selected exercise type */}
      {renderExerciseFields()}
    </CustomModal>
  );
}
