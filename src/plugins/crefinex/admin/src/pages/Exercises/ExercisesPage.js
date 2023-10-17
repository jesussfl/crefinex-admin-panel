import React from "react";
import { useParams, useHistory } from "react-router-dom";

// Importing components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb } from "@strapi/design-system";
import { ExercisesTable, CustomAlert, CustomLoader, CustomTable, ExercisesModal, DeleteDialog } from "../../components";
import { Plus, ArrowLeft } from "@strapi/icons";
import { ExerciseRows } from "../../components/Tables/Rows/ExerciseRows";

// Importing utility hooks and functions
import { useQuery } from "@tanstack/react-query";
import { useModal } from "../../utils/contexts/ModalContext";
import { QUERY_KEYS } from "../../utils/constants/queryKeys.constants";
import { usePagination } from "../../utils/hooks/usePagination";
import { query } from "../../utils/graphql/client/GraphQLCLient";
import { queryExercisesByLessonId } from "../../utils/graphql/queries/exercise.queries";
import {
  createExerciseMutation as createMutation,
  updateExerciseMutation as updateMutation,
  deleteExerciseMutation as deleteMutation,
} from "../../utils/graphql/mutations/exercise.mutations";

function ExercisesPage() {
  const history = useHistory();
  const { lessonId } = useParams();
  const { currentPage, rowsPerPage } = usePagination();

  // Fetch data for exercises using React Query
  const {
    data: exercisesData,
    isLoading,
    error,
  } = useQuery([QUERY_KEYS, lessonId], () =>
    query(queryExercisesByLessonId, {
      id: lessonId,
      start: currentPage,
      limit: rowsPerPage,
    })
  );
  const { setShowModal } = useModal();

  if (isLoading) return <CustomLoader />;

  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  // Extracting data from the query response
  const exercises = exercisesData.exercisesByLesson;
  const lessonInfo = exercises.lesson;
  const world = exercises.lesson?.world?.data?.attributes.name;

  return (
    <>
      <BaseHeaderLayout
        navigationAction={
          <Link startIcon={<ArrowLeft />} onClick={() => history.goBack()}>
            Volver
          </Link>
        }
        primaryAction={
          // Button to open a modal for adding a new exercise
          <Button startIcon={<Plus />} onClick={() => setShowModal(true)}>
            Añadir un ejercicio
          </Button>
        }
        title="Ejercicios"
        subtitle={
          // Breadcrumbs displaying navigation path
          <Breadcrumbs label="folders">
            <Crumb>{`Mundo: ${world}`}</Crumb>
            <Crumb>{`Sección: ${exercises.lesson?.section?.data?.attributes?.description} (ID: ${lessonInfo?.section?.data?.id})`}</Crumb>
            <Crumb>{`Lección: ${lessonInfo?.description} (ID: ${lessonId})`}</Crumb>
          </Breadcrumbs>
        }
        as="h2"
      />

      <ContentLayout>
        <CustomTable
          // Custom table configuration
          config={{
            tableName: "exercises",
            emptyStateMessage: "No hay ejercicios aún",
            createModal: () => <ExercisesModal mainAction={createMutation} data={lessonInfo} lessonId={lessonId} />,
            editModal: () => <ExercisesModal mainAction={updateMutation} data={lessonInfo} lessonId={lessonId} />,
            deleteDialog: () => <DeleteDialog mainAction={deleteMutation} section={"exercises"} />,
          }}
          // Pass data and pagination information to the CustomTable component
          data={exercises.exercises}
          paginationData={exercises.pagination}
          lessonId={lessonId}
          lessonInfo={lessonInfo}
        >
          {/* Render rows for the exercises table */}
          <ExerciseRows data={exercises.exercises} />
        </CustomTable>
      </ContentLayout>
    </>
  );
}

export default ExercisesPage;
