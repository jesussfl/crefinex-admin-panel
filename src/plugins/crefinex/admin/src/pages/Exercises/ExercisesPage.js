import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

// Importing components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb } from "@strapi/design-system";
import { CustomAlert, CustomLoader, ExercisesModal, DeleteDialog } from "../../components";
import { Plus, ArrowLeft } from "@strapi/icons";

// Importing utility hooks and functions
import { useQuery } from "@tanstack/react-query";
import { useModal } from "../../utils/contexts/ModalContext";
import { QUERY_KEYS } from "../../utils/constants/queryKeys.constants";
import { usePagination } from "../../utils/hooks/usePagination";
import { query } from "../../utils/graphql/client/GraphQLCLient";
import { queryExercisesByLessonId } from "../../utils/graphql/queries/exercise.queries";
import {
  createExerciseMutation as createMutation,
  deleteExerciseMutation as deleteMutation,
} from "../../utils/graphql/mutations/exercise.mutations";
import CustomTable from "../../components/table";
import defaultColumns from "./columns";
import { formatData } from "../../utils/helpers/reduceAttributesFromData";
function ExercisesPage() {
  const history = useHistory();
  const { lessonId } = useParams();
  const { currentPage, rowsPerPage } = usePagination();
  const [tableData, setTableData] = React.useState([]);
  const { modalHandler, setShowModal } = useModal();
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

  useEffect(() => {
    setTableData(formatData(exercisesData?.exercisesByLesson?.exercises));
  }, [exercisesData]);
  if (isLoading) return <CustomLoader />;

  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  // Extracting data from the query response
  const exercises = exercisesData.exercisesByLesson;
  const lessonInfo = exercises.lesson;
  const world = exercises.lesson?.world?.data?.attributes.name;

  return (
    <div style={{ width: "83vw", marginBottom: "48px" }}>
      <BaseHeaderLayout
        navigationAction={
          <Link startIcon={<ArrowLeft />} onClick={() => history.goBack()}>
            Volver
          </Link>
        }
        primaryAction={
          // Button to open a modal for adding a new exercise
          <Button startIcon={<Plus />} onClick={() => modalHandler.open("create")}>
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
        <CustomTable data={tableData} columns={defaultColumns()} />
        {modalHandler.type === "create" && <ExercisesModal mainAction={createMutation} data={lessonInfo} lessonId={lessonId} />}
        {modalHandler.type === "delete" && <DeleteDialog mainAction={deleteMutation} section={"exercises"} />}
      </ContentLayout>
    </div>
  );
}

export default ExercisesPage;
