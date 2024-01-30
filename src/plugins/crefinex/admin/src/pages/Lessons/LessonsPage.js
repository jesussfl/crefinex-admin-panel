import React from "react";

// Components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb, Box, Layout } from "@strapi/design-system";
import { Plus, ArrowLeft } from "@strapi/icons";
import { CustomAlert, Loader } from "../../components";
import Table from "../../components/Table";
import LessonForm from "./components/form";

// Utility hooks and functions
import { useModal } from "../../utils";
import { useParams, useHistory } from "react-router-dom";
import { getLessonsBySection } from "../../utils/data/getData";

// Columns
import defaultColumns from "./columns";
import { DeleteDialog } from "./components/dialog";

function LessonsPage() {
  const history = useHistory();
  const { sectionId } = useParams();
  const { modalHandler, defaultValues } = useModal();
  const { lessons, isLoading, error } = getLessonsBySection(sectionId);

  if (isLoading) return <Loader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  return (
    <Box>
      <Layout>
        <BaseHeaderLayout
          navigationAction={
            <Link startIcon={<ArrowLeft />} onClick={() => history.goBack()}>
              Volver
            </Link>
          }
          primaryAction={
            <Button startIcon={<Plus />} onClick={() => modalHandler.open("create")}>
              Añadir Lección
            </Button>
          }
          title="Lecciones"
          subtitle={
            <Breadcrumbs label="folders">
              <Crumb>{`Mundo: Insert`}</Crumb>
              <Crumb>{`Sección: Insert (ID: ${sectionId})`}</Crumb>
            </Breadcrumbs>
          }
          as="h2"
        />
        <ContentLayout>
          <Table data={lessons} columns={defaultColumns(modalHandler)} />
          {(modalHandler.type === "create" || modalHandler.type === "edit") && (
            <LessonForm sectionId={sectionId} defaultValues={defaultValues} />
          )}
          {modalHandler.type === "delete" && <DeleteDialog />}
        </ContentLayout>
      </Layout>
    </Box>
  );
}

export default LessonsPage;
