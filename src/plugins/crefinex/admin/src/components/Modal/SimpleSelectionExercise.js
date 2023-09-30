import React, { useState } from "react";
import { Plus } from "@strapi/icons";
import { Button, TextInput } from "@strapi/design-system";
import { useEffect } from "react";

function SimpleSelectionExercise({ onContentChange }) {
  const [content, setContent] = useState({
    question: "",
    options: [],
    correctAnswerIndex: null,
  });

  const [correctOptions, setCorrectOptions] = useState([]);

  const addOption = () => {
    const updatedOptions = [...content.options, { text: "" }];
    setContent((prevContent) => ({
      ...prevContent,
      options: updatedOptions,
    }));
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...content.options];
    updatedOptions[index].text = e.target.value;
    setContent((prevContent) => ({
      ...prevContent,
      options: updatedOptions,
    }));
  };

  const removeOption = (index) => {
    const updatedOptions = content.options.filter((_, i) => i !== index);
    setContent((prevContent) => ({
      ...prevContent,
      options: updatedOptions,
    }));
  };

  const setCorrectOption = (index) => {
    const isAlreadyCorrect = correctOptions.includes(index);

    let updatedCorrectOptions = [];
    if (!isAlreadyCorrect) {
      // Si la opción no estaba marcada como correcta, marcamos la nueva opción.
      updatedCorrectOptions = [index];
    }

    setContent((prevContent) => ({
      ...prevContent,
      correctAnswerIndex: isAlreadyCorrect ? null : index,
    }));

    setCorrectOptions(updatedCorrectOptions);
  };

  const handleQuestionChange = (e) => {
    const updatedQuestion = e.target.value;
    setContent((prevContent) => ({
      ...prevContent,
      question: updatedQuestion,
    }));
  };

  useEffect(() => {
    // Llama a onContentChange después de que el estado se haya actualizado
    onContentChange(content);
  }, [content]);

  return (
    <>
      <TextInput
        placeholder="Ingresa la pregunta"
        label="Pregunta"
        name="question"
        value={content.question}
        onChange={handleQuestionChange}
      />
      {content.options &&
        content.options.map((option, index) => (
          <div key={index}>
            <TextInput
              placeholder={`Ingresa el texto de la opción ${index + 1}`}
              label={`Opción n°${index + 1}`}
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
                {correctOptions.includes(index) ? "Opción correcta" : "Marcar como opción correcta"}
              </Button>
              <Button variant="danger" onClick={() => removeOption(index)}>
                Quitar
              </Button>
            </div>
          </div>
        ))}
      <Button variant="secondary" startIcon={<Plus />} onClick={addOption}>
        Añade una opción
      </Button>
    </>
  );
}

export default SimpleSelectionExercise;
