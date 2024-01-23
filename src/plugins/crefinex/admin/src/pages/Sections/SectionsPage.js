import React from "react";

import { BaseHeaderLayout, Button } from "@strapi/design-system";
import { CustomAlert, Loader, DeleteDialog } from "../../components";
import { deleteSection } from "../../utils/graphql/mutations/section.mutations";
import { Plus } from "@strapi/icons";
import { useModal } from "../../utils";

import defaultColumns from "./columns";
import CustomTable from "../../components/table";

import { getSections } from "../../utils/data/getData";
import SectionForm from "./components/form";
function SectionsPage() {
  const { modalHandler, showModal, defaultValues } = useModal();
  const { sections, isLoading, error } = getSections();

  if (isLoading && !sections) return <Loader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  return (
    <div
      style={{
        maxWidth: "88vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: " 0 56px 56px 56px",
      }}
    >
      <BaseHeaderLayout
        title="Secciones"
        subtitle="Aquí podrás añadir las secciones de los mundos creados."
        as="h2"
        primaryAction={
          <Button startIcon={<Plus />} onClick={() => modalHandler.open("create")}>
            Añadir sección
          </Button>
        }
      />
      <div style={{ height: "100%" }}>
        <CustomTable data={sections} columns={defaultColumns()} />
        {showModal && <SectionForm defaultValues={defaultValues} />}
        {modalHandler.type === "delete" && <DeleteDialog mainAction={deleteSection} section={"sections"} />}
      </div>
    </div>
  );
}

export default SectionsPage;
