import React, { useState, useEffect } from "react";
import { Button, TextInput } from "@strapi/design-system";
import { Controller } from "react-hook-form";

function CompletionExercise({ control, onContentChange, exerciseContent }) {
  const [completionText, setCompletionText] = useState("");
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [inputIncorrectWord, setInputIncorrectWord] = useState("");

  useEffect(() => {
    // Update the exercise in exerciseContent only when final
    const updatedExerciseContent = {
      ...exerciseContent,
      completionText,
      correctWords,
      incorrectWords,
    };

    onContentChange(updatedExerciseContent);
  }, [completionText, correctWords, incorrectWords]);

  // Handle change in the completion sentence input
  const handleCompletionTextChange = (e) => {
    const text = e.target.value;
    setCompletionText(text);

    // Find words enclosed in curly braces {}
    const matches = text.match(/\{([^}]+)\}/g);

    if (matches) {
      const wordsInBrackets = matches.map((match) => match.substring(1, match.length - 1).trim());

      // Add found words to correctWords and remove duplicates
      setCorrectWords([...new Set(wordsInBrackets)]);
    }
  };

  // Handle adding incorrect word
  const handleIncorrectWordAdd = () => {
    if (inputIncorrectWord) {
      // Add the incorrect word to incorrectWords
      setIncorrectWords([...incorrectWords, inputIncorrectWord]);

      // Clear the input field
      setInputIncorrectWord("");
    }
  };

  return (
    <>
      <Controller
        name="completionSentence"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Agrega la oración aquí"
            label="Oración de completar"
            name="completionSentence"
            hint="Cierra con llaves las palabras que deseas llenar en el ejercicio"
            value={completionText}
            onChange={handleCompletionTextChange}
          />
        )}
      ></Controller>

      <div>
        <h3 style={{ color: "#fff" }}>Palabras Correctas:</h3>
        <ul style={{ color: "#fff" }}>
          {correctWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 style={{ color: "#fff" }}>Palabras Incorrectas:</h3>
        <ul style={{ color: "#fff" }}>
          {incorrectWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>

      <div>
        <div>
          <TextInput
            label="Palabra Incorrecta"
            placeholder="Ingrese una palabra incorrecta"
            value={inputIncorrectWord}
            onChange={(e) => setInputIncorrectWord(e.target.value)}
          />
          <Button style={{ marginTop: "10px" }} onClick={handleIncorrectWordAdd}>
            Agregar
          </Button>
        </div>
      </div>
    </>
  );
}

export default CompletionExercise;
