import React from "react";

import { Controller, useFormContext } from "react-hook-form";
import { TextInput } from "@strapi/design-system";

import Wysiwyg from "../../../../components/Wysiwyg/Wysiwyg";

const MAX_WYSIWYG_LENGTH = 1000;
function TheoryExerciseForm() {
  const form = useFormContext();

  return (
    <>
      <Controller
        name={`content.title`}
        control={form.control}
        rules={{
          required: "Este campo es requerido",
        }}
        render={({ field, fieldState }) => (
          <TextInput
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value || ""}
            label={"Título de la teoría"}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name={"content.theory"}
        control={form.control}
        rules={{
          required: "Este campo es obligatorio",
          maxLength: { value: MAX_WYSIWYG_LENGTH, message: `Máximo ${MAX_WYSIWYG_LENGTH} caracteres` },
          minLength: { value: 100, message: "El contenido es muy corto" },
        }}
        render={({ field, fieldState }) => (
          <Wysiwyg
            name={"content"}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
            displayName={"Teoria"}
            error={fieldState.error?.message}
          />
        )}
      />
    </>
  );
}

export default TheoryExerciseForm;
