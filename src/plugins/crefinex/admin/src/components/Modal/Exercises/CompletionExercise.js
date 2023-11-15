import React, { useState, useEffect, forwardRef } from "react";
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

const TextInputControlled = forwardRef(({ name, control, rules, placeholder, label }, ref) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <TextInput
          onChange={(e) => {
            const newValue = e.target.value;
            // Verificar la longitud del valor y truncarlo si es necesario
            if (newValue.length <= MAX_DESCRIPTION_LENGTH) {
              setInputValue(newValue);
              onChange(newValue);
            }
          }}
          onBlur={onBlur}
          value={inputValue || value}
          ref={ref}
          placeholder={placeholder}
          label={label}
          hint={`${MAX_DESCRIPTION_LENGTH} carácteres como máximo`}
          error={fieldState.error?.message}
        />
      )}
    />
  );
});
export default CompletionExercise;
