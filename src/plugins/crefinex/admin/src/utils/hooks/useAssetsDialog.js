import { useLibrary } from "@strapi/helper-plugin";
import { useState } from "react";

export const useAssetsDialog = () => {
  const { components } = useLibrary();
  const AssetsDialog = components["media-library"];
  const [isAssetsDialogOpen, setIsAssetsDialogOpen] = useState(false);

  const toggleAssetsDialog = () => {
    setIsAssetsDialogOpen(!isAssetsDialogOpen);
  };

  return {
    AssetsDialog,
    isAssetsDialogOpen,
    toggleAssetsDialog,
  };
};
