import React, { useState } from "react";
import { Plus } from "@strapi/icons";
import { Button, TextInput, Typography } from "@strapi/design-system";
import { prefixFileUrlWithBackendUrl } from "@strapi/helper-plugin";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { useAssetsDialog } from "../../../../utils/hooks/useAssetsDialog";

function SimpleSelectionForm() {
  const form = useFormContext();
  const { AssetsDialog, isAssetsDialogOpen, toggleAssetsDialog } = useAssetsDialog();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content.options",
  });

  const [optionIndex, setOptionIndex] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const selectAssets = (files) => {
    const formattedFiles = files.map((file) => prefixFileUrlWithBackendUrl(file.url));
    if (formattedFiles.length > 1) {
      return;
    }

    form.setValue(`content.options.${optionIndex}.image`, formattedFiles[0]);

    toggleAssetsDialog();
  };

  const handleCorrectAnswer = (index) => {
    if (correctAnswer === index) {
      form.setValue(`content.options.${index}.isCorrect`, false);
      setCorrectAnswer(null);
      return;
    }

    if (correctAnswer !== null) {
      form.setValue(`content.options.${correctAnswer}.isCorrect`, false);
    }

    form.setValue(`content.options.${index}.isCorrect`, true);
    setCorrectAnswer(index);
  };

  return (
    <>
      <Controller
        name={`content.question`}
        control={form.control}
        rules={{
          required: "Este campo es requerido",
        }}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            label={"Pregunta del ejercicio"}
            error={fieldState.error?.message}
          />
        )}
      />
      {fields.map((field, index) => (
        <div key={field.id}>
          <Controller
            name={`content.options.${index}.text`}
            control={form.control}
            rules={{
              required: "Este campo es requerido",
            }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <TextInput
                onChange={onChange}
                onBlur={onBlur}
                value={value || ""}
                label={"Opción " + (index + 1)}
                placeholder="Ingresa la respuesta"
                error={fieldState.error?.message}
              />
            )}
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
            {form.watch(`content.options.${index}.image`) ? (
              <Typography style={{ fontSize: "12px" }}>Imagen Añadida: {form.watch(`options.${index}.image`)}</Typography>
            ) : (
              <Typography style={{ fontSize: "12px" }}>Sin imagen</Typography>
            )}
            <Button
              onClick={() => {
                setOptionIndex(index);
                toggleAssetsDialog();
              }}
            >
              Añadir imágen
            </Button>
            <Button
              variant={form.watch(`content.options.${index}.isCorrect`) === true ? "success" : "default"}
              onClick={() => handleCorrectAnswer(index)}
            >
              {form.watch(`content.options.${index}.isCorrect`) === true ? "Marcada como correcta" : "Marcar como correcta"}
            </Button>

            <Button variant="danger" onClick={() => remove(index)}>
              Quitar opción
            </Button>
          </div>
        </div>
      ))}

      <Button variant="secondary" startIcon={<Plus />} onClick={() => append()}>
        Añadir una opción
      </Button>
      {isAssetsDialogOpen && <AssetsDialog onClose={toggleAssetsDialog} onSelectAssets={selectAssets} />}
    </>
  );
}

export default SimpleSelectionForm;
