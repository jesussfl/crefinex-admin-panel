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
  const { modalHandler, defaultValues } = useModal();
  const { sections, isLoading, error } = getSections();
  console.log(modalHandler.type);
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
          {(modalHandler.type === "create" || modalHandler.type === "edit") && <SectionForm defaultValues={defaultValues} />}
          {modalHandler.type === "delete" && <DeleteDialog />}
          {modalHandler.type === "status" && <StatusDialog status={defaultValues} />}
        </ContentLayout>
      </Layout>
    </Box>
  );
}

export default SectionsPage;
