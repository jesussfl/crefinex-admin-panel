import React, { useState, useEffect } from "react";
import { Button, TextInput } from "@strapi/design-system";
import { Controller } from "react-hook-form";

function WordMemoryExercise({ control, onContentChange, exerciseContent }) {
  const [wordDefinitions, setWordDefinitions] = useState({});
  const [currentWord, setCurrentWord] = useState("");
  const [currentDefinition, setCurrentDefinition] = useState("");

  useEffect(() => {
    // Actualiza el ejercicio en exerciseContent
    const updatedExerciseContent = {
      ...exerciseContent,
      wordDefinitions,
    };

    onContentChange(updatedExerciseContent);
  }, [wordDefinitions, exerciseContent, onContentChange]);

  const handleAddWord = () => {
    if (currentWord && currentDefinition) {
      // Agregar la palabra y su definición al objeto wordDefinitions
      setWordDefinitions({
        ...wordDefinitions,
        [currentWord]: currentDefinition,
      });

      // Limpiar los campos de entrada
      setCurrentWord("");
      setCurrentDefinition("");
    }
  };

  const handleRemoveWord = (word) => {
    // Eliminar una palabra y su definición del objeto wordDefinitions
    const updatedWordDefinitions = { ...wordDefinitions };
    delete updatedWordDefinitions[word];
    setWordDefinitions(updatedWordDefinitions);
  };

  return (
    <>
      <div>
        <Controller
          name="memoryWords"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="Type a word"
              label="Memory Word"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddWord();
                }
              }}
            />
          )}
        />
        <TextInput
          placeholder="Type its definition"
          label="Definition"
          value={currentDefinition}
          onChange={(e) => setCurrentDefinition(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddWord();
            }
          }}
        />
        <Button onClick={handleAddWord}>Add Word</Button>
      </div>

      <div>
        <h3>Memory Words and Definitions:</h3>
        <ul>
          {Object.entries(wordDefinitions).map(([word, definition], index) => (
            <li key={index}>
              {word} - {definition}
              <Button onClick={() => handleRemoveWord(word)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default WordMemoryExercise;
