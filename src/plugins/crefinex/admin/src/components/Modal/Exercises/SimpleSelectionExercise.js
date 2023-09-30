import React, { useState } from "react";
import { Plus } from "@strapi/icons";
import { Button, TextInput } from "@strapi/design-system";
import { useEffect } from "react";

function SimpleSelectionExercise({ onContentChange }) {
  const [content, setContent] = useState({
    question: "", // Question text
    options: [], // Array to store answer options
    correctAnswerIndex: null, // Index of the correct answer
  });

  const [correctOptions, setCorrectOptions] = useState([]); // Array to store indices of correct answers

  // Function to add a new answer option
  const addOption = () => {
    const updatedOptions = [...content.options, { text: "" }];
    setContent((prevContent) => ({
      ...prevContent,
      options: updatedOptions,
    }));
  };

  // Function to handle changes in an answer option
  const handleOptionChange = (e, index) => {
    const updatedOptions = [...content.options];
    updatedOptions[index].text = e.target.value;
    setContent((prevContent) => ({
      ...prevContent,
      options: updatedOptions,
    }));
  };

  // Function to remove an answer option
  const removeOption = (index) => {
    const updatedOptions = content.options.filter((_, i) => i !== index);
    setContent((prevContent) => ({
      ...prevContent,
      options: updatedOptions,
    }));
  };

  // Function to set an answer option as correct
  const setCorrectOption = (index) => {
    const isAlreadyCorrect = correctOptions.includes(index);

    let updatedCorrectOptions = [];
    if (!isAlreadyCorrect) {
      // If the option was not marked as correct, mark the new option.
      updatedCorrectOptions = [index];
    }

    setContent((prevContent) => ({
      ...prevContent,
      correctAnswerIndex: isAlreadyCorrect ? null : index,
    }));

    setCorrectOptions(updatedCorrectOptions);
  };

  // Function to handle changes in the question text
  const handleQuestionChange = (e) => {
    const updatedQuestion = e.target.value;
    setContent((prevContent) => ({
      ...prevContent,
      question: updatedQuestion,
    }));
  };

  // useEffect to call onContentChange after the state has been updated
  useEffect(() => {
    onContentChange(content);
  }, [content]);

  return (
    <>
      <TextInput
        placeholder="Ingresa la pregunta del ejercicio"
        label="Pregunta"
        name="question"
        value={content.question}
        onChange={handleQuestionChange}
      />
      {content.options &&
        content.options.map((option, index) => (
          <div key={index}>
            <TextInput
              placeholder={`Ingresa el texto de la opción n° ${index + 1}`}
              label={`Opción n° ${index + 1}`}
              name={`optionText${index}`}
              value={option.text}
              onChange={(e) => handleOptionChange(e, index)}
            />
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "8px",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button variant={correctOptions.includes(index) ? "success" : "default"} onClick={() => setCorrectOption(index)}>
                {correctOptions.includes(index) ? "Marcado como correcta" : "Marcar como correcta"}
              </Button>
              <Button variant="danger" onClick={() => removeOption(index)}>
                Quitar
              </Button>
            </div>
          </div>
        ))}
      <Button variant="secondary" startIcon={<Plus />} onClick={addOption}>
        Añadir una opción
      </Button>
    </>
  );
}

export default SimpleSelectionExercise;
