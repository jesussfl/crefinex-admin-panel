import React, { useState } from "react";
import { Button, Flex, TextInput, Typography } from "@strapi/design-system";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

function CompletionExerciseForm() {
  const [correctWords, setCorrectWords] = useState([]);
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content.words",
  });
  const handleCompletionTextChange = (text) => {
    //This method is called when the user blur the input field

    form.setValue("content.completionSentence", text);

    // Find words enclosed in curly braces {}
    const matches = text.match(/\{([^}]+)\}/g);

    if (matches) {
      const wordsInBrackets = matches.map((match) => match.substring(1, match.length - 1).trim());

      // This is to remove words that are already in the list
      if (fields.length > 0) {
        fields.forEach((field, index) => {
          if (wordsInBrackets.includes(field.name)) {
            remove(index);
          }
        });
      }

      // Append the new words
      append(wordsInBrackets.map((word) => ({ name: word, isCorrect: true })));

      // Add found words to correctWords and remove duplicates
      setCorrectWords([...new Set(wordsInBrackets)]);

      return;
    }

    // This is to remove words that are already in the list if matches is null
    if (fields.length > 0) {
      fields.forEach((field, index) => {
        if (correctWords.includes(field.name)) {
          remove(index);
        }
      });
    }
  };

  return (
    <>
      <Controller
        name="content.completionSentence"
        control={form.control}
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Agrega la oración aquí"
            label="Oración de completar"
            name="completionSentence"
            hint="Cierra con llaves las palabras que deseas llenar en el ejercicio"
            onBlur={(e) => handleCompletionTextChange(e.target.value)}
          />
        )}
      />

      <Flex alignItems="start" gap={4} justifyContent="space-between" direction="row">
        <Flex alignItems="start" gap={2} direction="column">
          <Typography>Palabras Correctas:</Typography>

          {fields.map((field, index) => {
            if (field.isCorrect === false) {
              return null;
            }
            return (
              <Flex alignItems="start" gap={2} key={field.id}>
                <Controller
                  name={`content.words.${index}.name`}
                  control={form.control}
                  rules={{
                    required: "Este campo es requerido",
                  }}
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <TextInput
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || ""}
                      label="Palabra correcta"
                      disabled={true}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </Flex>
            );
          })}
        </Flex>
        <Flex alignItems="end" gap={2} direction="column">
          <Typography>Palabras Incorrectas:</Typography>
          <Button variant="secondary" onClick={() => append({ name: "", isCorrect: false })}>
            Agregar palabra incorrecta
          </Button>

          <Flex alignItems="end" gap={2} direction="column-reverse">
            {fields.map((field, index) => {
              if (field.isCorrect === true) {
                return null;
              }
              return (
                <Flex gap={2} key={field.id}>
                  <Controller
                    name={`content.words.${index}.name`}
                    control={form.control}
                    rules={{
                      required: "Este campo es requerido",
                    }}
                    render={({ field: { onChange, onBlur, value }, fieldState }) => (
                      <TextInput
                        onChange={onChange}
                        onBlur={onBlur}
                        label="Palabra incorrecta"
                        value={value || ""}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Button onClick={() => remove(index)}>Eliminar</Button>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default CompletionExerciseForm;
