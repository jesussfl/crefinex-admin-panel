import React, { useEffect, useState } from "react";
import { Plus } from "@strapi/icons";
import { Button, TextInput, Typography, SingleSelect, SingleSelectOption, Divider } from "@strapi/design-system";
import { prefixFileUrlWithBackendUrl } from "@strapi/helper-plugin";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { useAssetsDialog } from "../../../../utils/hooks/useAssetsDialog";
import { useModal } from "../../../../utils";

function MemoryForm() {
  const { modalHandler, defaultValues } = useModal();

  const form = useFormContext();
  const { AssetsDialog, isAssetsDialogOpen, toggleAssetsDialog } = useAssetsDialog();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "content.options",
  });
  const isEditEnabled = !!defaultValues;
  const [pairIndex, setPairIndex] = useState(null);

  const selectAssets = (files) => {
    const formattedFiles = files.map((file) => prefixFileUrlWithBackendUrl(file.url));
    if (formattedFiles.length > 1) {
      return;
    }

    form.setValue(`content.options.${pairIndex}.image`, formattedFiles[0]);

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
            label={"Descripción"}
            placeholder="Ingresa la descripción"
            error={fieldState.error?.message}
          />
        )}
      />

      <Divider />

      {fields.map((field, index) => (
        <div key={field.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
              <Typography width={300} style={{ fontSize: "14px" }}>
                Opción: {index + 1}
              </Typography>
              <Controller
                name={`content.options.${index}.type`}
                control={form.control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field, fieldState }) => (
                  <SingleSelect
                    onChange={(event) => {
                      field.onChange(event);

                      // TODO Add a warning message if the user tries to change the type
                      form.resetField(`content.options.${index}.image`);
                      form.resetField(`content.options.${index}.text`);
                    }}
                    onBlur={(e) => field.onBlur(e.target.value)}
                    value={field.value || ""}
                    placeholder="Selecciona el tipo de la opción"
                    label="Tipo de la opción"
                    error={fieldState.error?.message}
                  >
                    <SingleSelectOption value="image">Imágen</SingleSelectOption>
                    <SingleSelectOption value="text">Texto</SingleSelectOption>
                  </SingleSelect>
                )}
              />
              {form.watch(`content.options.${index}.type`) === "image" ? (
                form.watch(`content.options.${index}.image`) ? (
                  <>
                    <Typography style={{ fontSize: "12px" }}>Imagen Añadida: </Typography>
                    <img
                      //   src={form.watch(`content.pairs.${index}.option.image`)}
                      src={form.watch(`content.options.${index}.image`)}
                      alt=""
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </>
                ) : (
                  <>
                    <Typography style={{ fontSize: "12px" }}>Sin imagen</Typography>
                    <Button
                      onClick={() => {
                        setPairIndex(index);
                        toggleAssetsDialog();
                      }}
                    >
                      Añadir imágen
                    </Button>
                  </>
                )
              ) : (
                form.watch(`content.options.${index}.type`) === "text" && (
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
                        style={{ width: "300px" }}
                      />
                    )}
                  />
                )
              )}
              <Controller
                name={`content.options.${index}.identifier`}
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
        Añadir opción a memorizar
      </Button>
      {isAssetsDialogOpen && <AssetsDialog onClose={toggleAssetsDialog} onSelectAssets={selectAssets} />}
    </>
  );
}

export default MemoryForm;
