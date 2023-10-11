import React, { useState } from "react";
import { Button, Stack, Flex, Field, FieldLabel } from "@strapi/design-system";
import { useLibrary, prefixFileUrlWithBackendUrl } from "@strapi/helper-plugin";
import Editor from "../QuillEditor";

const Wysiwyg = ({ name, onChange, value, displayName, error }) => {
  const [showMediaLibDialog, setShowMediaLibDialog] = useState(false);
  const { components } = useLibrary();
  const MediaLibDialog = components["media-library"];
  // console.log("value ", value);
  const handleToggleMediaLibDialog = () => {
    setShowMediaLibDialog(!showMediaLibDialog);
  };

  const handleSelectAssets = (files) => {
    const formattedFiles = files.map((file) => ({
      alt: file.alternativeText || file.name,
      url: prefixFileUrlWithBackendUrl(file.url),
      mime: file.mime,
    }));
    const images = formattedFiles.map((image) => `<image src='${image.url}' alt='${image.alt}'>`).join();

    // Combina las imágenes seleccionadas con el contenido actual
    const updatedContent = value + images;
    onChange(updatedContent);
    handleToggleMediaLibDialog();
  };

  return (
    <div>
      <Field name={name}>
        <Stack spacing={2} padding={2}>
          <Flex gap={2}>
            <FieldLabel>{displayName}</FieldLabel>
            <Button variant="secondary" onClick={handleToggleMediaLibDialog}>
              Añadir Imágen
            </Button>
          </Flex>
          <Editor name={name} onChange={onChange} value={value} />
        </Stack>
        {showMediaLibDialog && <MediaLibDialog onClose={handleToggleMediaLibDialog} onSelectAssets={handleSelectAssets} />}
        <p style={{ color: "red", fontSize: "12px" }}> {error}</p>
      </Field>
    </div>
  );
};

export default Wysiwyg;
