import React, { useEffect, useState } from "react";
import { Plus } from "@strapi/icons";
import { Button, TextInput, Typography, SingleSelect, SingleSelectOption, Divider } from "@strapi/design-system";
import { prefixFileUrlWithBackendUrl } from "@strapi/helper-plugin";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { useAssetsDialog } from "../../../../utils/hooks/useAssetsDialog";
import { useModal } from "../../../../utils";

function PairsForm() {
  const { modalHandler, defaultValues } = useModal();

  const form = useFormContext();
  const { AssetsDialog, isAssetsDialogOpen, toggleAssetsDialog } = useAssetsDialog();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content.pairs",
  });
  const isEditEnabled = !!defaultValues;
  const [pairIndex, setPairIndex] = useState(null);
  const [pairType, setPairType] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const answersType = form.watch("content.answersType");
  const optionsType = form.watch("content.optionsType");
  const selectAssets = (files) => {
    const formattedFiles = files.map((file) => prefixFileUrlWithBackendUrl(file.url));
    if (formattedFiles.length > 1) {
      return;
    }

    if (pairType === "answer") {
      form.setValue(`content.pairs.${pairIndex}.answer.image`, formattedFiles[0]);
      toggleAssetsDialog();

      return;
    }

    form.setValue(`content.pairs.${pairIndex}.option.image`, formattedFiles[0]);

    toggleAssetsDialog();
  };

  return (
    <>
      <Controller
        name={`content.description`}
        control={form.control}
        rules={{
          required: "Este campo es requerido",
        }}
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            label={"Descripción del pareo"}
            placeholder="Ingresa la descripción"
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name={"content.optionsType"}
        control={form.control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field, fieldState }) => (
          <SingleSelect
            onChange={(event) => {
              field.onChange(event);

              // TODO Add a warning message if the user tries to change the type
              form.resetField("content.options.data");
              if (isEditEnabled) {
                form.reset({ ...defaultValues, type: event, content: {} });
              }
            }}
            onBlur={(e) => field.onBlur(e.target.value)}
            value={field.value || ""}
            placeholder="Selecciona el tipo de las opciones"
            label="Tipo de las opciones"
            error={fieldState.error?.message}
          >
            <SingleSelectOption value="images">Imágenes</SingleSelectOption>
            <SingleSelectOption value="text">Textos</SingleSelectOption>
          </SingleSelect>
        )}
      />
      <Controller
        name={"content.answersType"}
        control={form.control}
        rules={{ required: "Este campo es requerido" }}
        render={({ field, fieldState }) => (
          <SingleSelect
            onChange={(event) => {
              field.onChange(event);

              // TODO Add a warning message if the user tries to change the type
              form.resetField("content.answers.data");
              if (isEditEnabled) {
                form.reset({ ...defaultValues, type: event, content: {} });
              }
            }}
            onBlur={(e) => field.onBlur(e.target.value)}
            value={field.value || ""}
            placeholder="Selecciona el tipo de las respuestas"
            label="Tipo de las respuestas"
            error={fieldState.error?.message}
          >
            <SingleSelectOption value="images">Imágenes</SingleSelectOption>
            <SingleSelectOption value="text">Textos</SingleSelectOption>
          </SingleSelect>
        )}
      />

      <Divider />

      {fields.map((field, index) => (
        <div key={field.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {optionsType === "images" ? (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
                <Typography width={300} style={{ fontSize: "14px" }}>
                  Opción: {index + 1}
                </Typography>

                {form.watch(`content.pairs.${index}.option.image`) ? (
                  <>
                    <Typography style={{ fontSize: "12px" }}>Imagen Añadida: </Typography>
                    <img
                      //   src={form.watch(`content.pairs.${index}.option.image`)}
                      src={form.watch(`content.pairs.${index}.option.image`)}
                      alt=""
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </>
                ) : (
                  <Typography style={{ fontSize: "12px" }}>Sin imagen</Typography>
                )}
                <Button
                  onClick={() => {
                    setPairType("option");
                    setPairIndex(index);
                    toggleAssetsDialog();
                  }}
                >
                  Añadir imágen
                </Button>
                <Controller
                  name={`content.pairs.${index}.option.identifier`}
                  control={form.control}
                  defaultValue={String(index)}
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <TextInput
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || index}
                      label={"Identificador: "}
                      disabled={true}
                      error={fieldState.error?.message}
                      style={{ width: "300px" }}
                    />
                  )}
                />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
                <Controller
                  name={`content.pairs.${index}.option.text`}
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
                      style={{ width: "300px" }}
                    />
                  )}
                />
                <Controller
                  name={`content.pairs.${index}.option.identifier`}
                  control={form.control}
                  defaultValue={String(index)}
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <TextInput
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || index}
                      label={"Identificador: "}
                      disabled={true}
                      error={fieldState.error?.message}
                      style={{ width: "300px" }}
                    />
                  )}
                />
              </div>
            )}

            {answersType === "images" ? (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
                <Typography style={{ fontSize: "14px" }}>Respuesta: {index + 1}</Typography>

                {form.watch(`content.pairs.${index}.answer.image`) ? (
                  <Typography style={{ fontSize: "12px" }}>Imagen Añadida: {form.watch(`options.pairs.${index}.answer.image`)}</Typography>
                ) : (
                  <Typography style={{ fontSize: "12px" }}>Sin imagen</Typography>
                )}
                <Button
                  onClick={() => {
                    setPairType("answer");
                    setPairIndex(index);
                    toggleAssetsDialog();
                  }}
                >
                  Añadir imágen
                </Button>
                <Controller
                  name={`content.pairs.${index}.answer.identifier`}
                  control={form.control}
                  defaultValue={String(index)}
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <TextInput
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || index}
                      label={"Identificador: "}
                      disabled={true}
                      error={fieldState.error?.message}
                      style={{ width: "300px" }}
                    />
                  )}
                />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
                <Controller
                  name={`content.pairs.${index}.answer.text`}
                  control={form.control}
                  rules={{
                    required: "Este campo es requerido",
                  }}
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <TextInput
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || ""}
                      label={"Respuesta " + (index + 1)}
                      placeholder="Ingresa la respuesta"
                      error={fieldState.error?.message}
                      style={{ width: "300px" }}
                    />
                  )}
                />
                <Controller
                  name={`content.pairs.${index}.answer.identifier`}
                  control={form.control}
                  defaultValue={String(index)}
                  render={({ field: { onChange, onBlur, value }, fieldState }) => (
                    <TextInput
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value || index}
                      label={"Identificador: "}
                      disabled={true}
                      error={fieldState.error?.message}
                      style={{ width: "300px" }}
                    />
                  )}
                />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: "8px",
            }}
          >
            <Button variant="danger" onClick={() => remove(index)}>
              Quitar opción
            </Button>
          </div>
          <Divider />
        </div>
      ))}

      <Button variant="secondary" startIcon={<Plus />} onClick={() => append()}>
        Añadir un par de opciones
      </Button>
      {isAssetsDialogOpen && <AssetsDialog onClose={toggleAssetsDialog} onSelectAssets={selectAssets} />}
    </>
  );
}

export default PairsForm;
