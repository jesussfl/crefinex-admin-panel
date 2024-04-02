import React from "react";

// Components and icons
import { BaseHeaderLayout, Box, Button, ContentLayout, Layout, Link } from "@strapi/design-system";
import { CustomAlert, Loader } from "../../components";
import { ArrowLeft, Plus } from "@strapi/icons";
import { DeleteDialog, StatusDialog } from "./components/dialog";
import Table from "../../components/Table";
import SectionForm from "./components/form";

// Utility hooks and functions
import { useModal } from "../../utils";
import { getSections, getSectionsByWorld } from "../../utils/data/getData";

// Columns
import defaultColumns from "./columns";
import { useParams, useHistory } from "react-router-dom";

function SectionsPage() {
  const history = useHistory();
  const { worldId } = useParams();
  const { modalHandler } = useModal();
  const { sections, isLoading, error } = getSectionsByWorld(worldId);
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
          navigationAction={
            <Link startIcon={<ArrowLeft />} onClick={() => history.goBack()}>
              Volver
            </Link>
          }
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
      {isModalOpen && <SectionForm worldId={worldId} />}
      <DeleteDialog />
      <StatusDialog />
    </Box>
  );
}

export default SectionsPage;
