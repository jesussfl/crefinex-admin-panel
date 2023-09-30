import React, { useState, useEffect } from "react";
import { Button, TextInput, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Controller } from "react-hook-form";

function CompletionExercise({ control, onContentChange, exerciseContent }) {
  const [completionText, setCompletionText] = useState("");
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [inputIncorrectWord, setInputIncorrectWord] = useState("");

  useEffect(() => {
    // Actualiza el ejercicio en exerciseContent solo al final
    const updatedExerciseContent = {
      ...exerciseContent,
      completionText,
      correctWords,
      incorrectWords,
    };

    onContentChange(updatedExerciseContent);
  }, [completionText, correctWords, incorrectWords]);

  const handleCompletionTextChange = (e) => {
    const text = e.target.value;
    setCompletionText(text);

    // Buscar palabras encerradas en llaves {}
    const matches = text.match(/\{([^}]+)\}/g);

    if (matches) {
      const wordsInBrackets = matches.map((match) => match.substring(1, match.length - 1).trim());

      // Agregar palabras encontradas a correctWords y eliminar duplicados
      setCorrectWords([...new Set(wordsInBrackets)]);
    }
  };

  const handleIncorrectWordAdd = () => {
    if (inputIncorrectWord) {
      // Agregar la palabra incorrecta a incorrectWords
      setIncorrectWords([...incorrectWords, inputIncorrectWord]);

      // Limpiar el campo de entrada
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
            placeholder="Add the sentence here"
            label="Completion Sentence"
            name="completionSentence"
            hint="close with curly brackets the words you want to be filled in the exercise"
            value={completionText}
            onChange={handleCompletionTextChange}
          />
        )}
      ></Controller>

      <div>
        <h3>Palabras Correctas:</h3>
        <ul>
          {correctWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Palabras Incorrectas:</h3>
        <ul>
          {incorrectWords.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Agregar Palabra Incorrecta:</h3>
        <div>
          <TextInput
            label="Palabra Incorrecta"
            placeholder="Ingrese una palabra incorrecta"
            value={inputIncorrectWord}
            onChange={(e) => setInputIncorrectWord(e.target.value)}
          />
          <Button onClick={handleIncorrectWordAdd}>Agregar</Button>
        </div>
      </div>
    </>
  );
}

export default CompletionExercise;
