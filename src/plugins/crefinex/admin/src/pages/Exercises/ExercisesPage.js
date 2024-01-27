import React from "react";
import { useParams, useHistory } from "react-router-dom";

// Components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb, Box, Layout } from "@strapi/design-system";
import { CustomAlert, Loader } from "../../components";
import { Plus, ArrowLeft } from "@strapi/icons";
import Table from "../../components/Table";

// Utility hooks and functions
import { useModal } from "../../utils/contexts/ModalContext";
import { getExercisesByLesson } from "../../utils/data/getData";

// Columns
import defaultColumns from "./columns";
import ExerciseForm from "./components/form/mainForm";

function ExercisesPage() {
  const history = useHistory();
  const { lessonId } = useParams();
  const { modalHandler, showModal, defaultValues } = useModal();
  const { exercises, isLoading, error } = getExercisesByLesson(lessonId);

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
              Añadir un ejercicio
            </Button>
          }
          title="Ejercicios"
          subtitle={
            <Breadcrumbs label="folders">
              <Crumb>{`Mundo: Insert`}</Crumb>
              <Crumb>{`Sección: Insert (ID: Insert`}</Crumb>
              <Crumb>{`Lección: Insert (ID: Insert)`}</Crumb>
            </Breadcrumbs>
          }
          as="h2"
        />

        <ContentLayout>
          <Table data={exercises} columns={defaultColumns()} />
          {showModal && <ExerciseForm defaultValues={defaultValues} lessonId={lessonId} />}
        </ContentLayout>
      </Layout>
    </Box>
  );
}

export default ExercisesPage;
