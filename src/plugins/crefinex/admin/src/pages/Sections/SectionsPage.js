import React from "react";

// Components and icons
import { BaseHeaderLayout, Box, Button, ContentLayout, Layout } from "@strapi/design-system";
import { CustomAlert, Loader } from "../../components";
import { Plus } from "@strapi/icons";
import { DeleteDialog, StatusDialog } from "./components/dialog";
import Table from "../../components/Table";
import SectionForm from "./components/form";

// Utility hooks and functions
import { useModal } from "../../utils";
import { getSections } from "../../utils/data/getData";

// Columns
import defaultColumns from "./columns";

function SectionsPage() {
  const { modalHandler } = useModal();
  const { sections, isLoading, error } = getSections();
  const isModalOpen = modalHandler.type === "create" || modalHandler.type === "edit";
  if (isLoading && !sections) return <Loader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  return (
    <Box>
      <Layout>
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
        <ContentLayout>
          <Table data={sections} columns={defaultColumns(modalHandler)} />
        </ContentLayout>
      </Layout>
      {isModalOpen && <SectionForm />}
      <DeleteDialog />
      <StatusDialog />
    </Box>
  );
}

export default SectionsPage;
