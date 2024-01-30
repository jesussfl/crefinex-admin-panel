import React from "react";
import { Plus } from "@strapi/icons";

import { Button, Flex, TextInput, Typography } from "@strapi/design-system";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

function WordMemoryForm() {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content.wordsAndDefinitions",
  });

  return (
    <>
      <Typography variant="beta">Coloca palabras y sus definiciones</Typography>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Flex justifyContent="space-between" gap={2}>
            <Controller
              name={`content.wordsAndDefinitions.${index}.word`}
              control={form.control}
              rules={{
                required: "Este campo es requerido",
              }}
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <TextInput
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  label={"Palabra " + (index + 1)}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name={`content.wordsAndDefinitions.${index}.definition`}
              control={form.control}
              rules={{
                required: "Este campo es requerido",
              }}
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <div style={{ width: "100%" }}>
                  <TextInput
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value || ""}
                    label={"Definición " + (index + 1)}
                    error={fieldState.error?.message}
                  />
                </div>
              )}
            />
          </Flex>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="danger" onClick={() => remove(index)}>
              Quitar opción
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="secondary"
        startIcon={<Plus />}
        onClick={() =>
          append({
            word: "",
            definition: "",
          })
        }
      >
        Añadir nueva palabra - definición
      </Button>
    </>
  );
}

export default WordMemoryForm;
