import React, { forwardRef, useState, useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { TextInput } from "@strapi/design-system";

import Wysiwyg from "../../Wysiwyg/Wysiwyg";

const MAX_DESCRIPTION_LENGTH = 100;
const MAX_WYSIWYG_LENGTH = 1000;
function TheoryExercise({ control, onContentChange, exerciseContent }) {
  const [content, setContent] = useState("");
  const [contentTitle, setContentTitle] = useState("");

  useEffect(() => {
    // Update the exercise in exerciseContent only when final
    const updatedExerciseContent = {
      ...exerciseContent,
      content,
      contentTitle,
    };
    onContentChange(updatedExerciseContent);
  }, [content, contentTitle]);
  return (
    <>
      <TextInputControlled
        name="contentTitle"
        control={control}
        rules={{
          required: "Este campo es obligatorio",
          maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Máximo ${MAX_DESCRIPTION_LENGTH} caracteres` },
          minLength: { value: 2, message: "Mínimo 2 caracteres" },
          pattern: { value: /^[a-zA-Z0-9\s]+$/, message: "Solo letras y números" },
        }}
        label="Título del contenido"
        placeholder="Añade un titulo interesante"
        setContentTitle={setContentTitle}
        contentTitle={contentTitle}
      />
      <WysiwygControlled
        name="content"
        displayName="Contenido a mostrar"
        control={control}
        rules={{
          required: "Este campo es obligatorio",
          maxLength: { value: MAX_WYSIWYG_LENGTH, message: `Máximo ${MAX_WYSIWYG_LENGTH} caracteres` },
          minLength: { value: 100, message: "El contenido es muy corto" },
        }}
        setContent={setContent}
        content={content}
      />
    </>
  );
}

export default TheoryExercise;
const TextInputControlled = forwardRef(({ name, control, rules, placeholder, label, setContentTitle, contentTitle }, ref) => {
  //   const [inputValue, setInputValue] = useState("");
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
              setContentTitle(newValue);
              onChange(newValue);
            }
          }}
          onBlur={onBlur}
          value={contentTitle || value}
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
const WysiwygControlled = forwardRef(({ name, control, rules, displayName, setContent, content }, ref) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState }) => (
      <>
        <Wysiwyg
          name={name}
          onChange={(e) => {
            const newValue = e.target.value;
            // Verificar la longitud del valor y truncarlo si es necesario
            if (newValue.length <= MAX_WYSIWYG_LENGTH) {
              setContent(newValue);
              onChange(newValue);
            }
          }}
          onBlur={onBlur}
          value={content || value}
          ref={ref}
          displayName={displayName}
          error={fieldState.error?.message}
        />
      </>
    )}
  />
));
