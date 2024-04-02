import React from "react";

// Components and icons
import { BaseHeaderLayout, Box, Button, ContentLayout, Layout } from "@strapi/design-system";
import { CustomAlert, Loader } from "../../components";
import { Plus } from "@strapi/icons";
import { DeleteDialog, StatusDialog } from "./components/dialog";
import Table from "../../components/Table";
import WorldsForm from "./components/form";

// Utility hooks and functions
import { useModal } from "../../utils";
import { getWorlds } from "../../utils/data/getData";

// Columns
import defaultColumns from "./columns";

function WorldsPage() {
  const { modalHandler } = useModal();
  const { worlds, isLoading, error } = getWorlds();
  const isModalOpen = modalHandler.type === "create" || modalHandler.type === "edit";
  if (isLoading && !worlds) return <Loader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  return (
    <Box>
      <Layout>
        <BaseHeaderLayout
          title="Mundos"
          subtitle="Aquí podrás añadir niveles de aprendizaje."
          as="h2"
          primaryAction={
            <Button startIcon={<Plus />} onClick={() => modalHandler.open("create")}>
              Añadir Mundo
            </Button>
          }
        />
        <ContentLayout>
          <Table data={worlds} columns={defaultColumns(modalHandler)} />
        </ContentLayout>
      </Layout>
      {isModalOpen && <WorldsForm />}
      <DeleteDialog />
      <StatusDialog />
    </Box>
  );
}

export default WorldsPage;
