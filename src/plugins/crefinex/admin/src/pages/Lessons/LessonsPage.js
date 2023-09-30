import React from "react";

// Importing components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb } from "@strapi/design-system";
import { Plus, ArrowLeft } from "@strapi/icons";
import { CustomAlert, CustomLoader, CustomTable, LessonModal, DeleteDialog } from "../../components";
import { LessonRows } from "../../components/Tables/ByPages/LessonRows";

// Importing utility hooks and functions
import { useModal, usePagination } from "../../utils";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys.constants";
import { query } from "../../graphql/client/GraphQLCLient";
import { queryLessonsBySectionId } from "../../graphql/queries/lesson.queries";
import {
  createLessonMutation as createMutation,
  updateLessonMutation as updateMutation,
  deleteLessonMutation as deleteMutation,
} from "../../graphql/mutations/lesson.mutations";

function LessonsPage() {
  // Hooks and parameters
  const history = useHistory();
  const { sectionId } = useParams();
  const { setShowModal } = useModal();
  const { currentPage, rowsPerPage } = usePagination();

  // Fetch data for lessons using React Query
  const { data, isLoading, error } = useQuery([QUERY_KEYS.lessons, sectionId, currentPage, rowsPerPage], () =>
    query(queryLessonsBySectionId, { id: sectionId, start: currentPage, limit: rowsPerPage })
  );

  // Constants for data from the query response
  const { lessonsBySection } = isLoading ? {} : data;
  const lessons = lessonsBySection?.lessons;
  const sectionInfo = lessonsBySection?.section;
  const world = lessonsBySection?.section?.world?.data?.attributes?.name;

  // Display error message if there is an error
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;

  return (
    <>
      {isLoading ? (
        // Show a loader while data is being fetched
        <CustomLoader />
      ) : (
        <>
          <BaseHeaderLayout
            // Header layout with navigation and primary actions
            navigationAction={
              <Link startIcon={<ArrowLeft />} onClick={() => history.goBack()}>
                Volver
              </Link>
            }
            primaryAction={
              // Button to open a modal for adding a new lesson
              <Button startIcon={<Plus />} onClick={() => setShowModal(true)}>
                Añadir una lección
              </Button>
            }
            title="Lecciones"
            subtitle={
              // Breadcrumbs displaying navigation path
              <Breadcrumbs label="folders">
                <Crumb>{`Mundo: ${world}`}</Crumb>
                <Crumb>{`Sección: ${lessonsBySection.section?.description} (ID: ${sectionId})`}</Crumb>
              </Breadcrumbs>
            }
            as="h2"
          />
          <ContentLayout>
            <CustomTable
              // Custom table configuration
              config={{
                tableName: "lessons",
                emptyStateMessage: "No hay lecciones aún",
                createModal: () => <LessonModal mainAction={createMutation} sectionInfo={sectionInfo} sectionId={sectionId} />,
                editModal: () => <LessonModal sectionInfo={sectionInfo} sectionId={sectionId} mainAction={updateMutation} />,
                deleteDialog: () => <DeleteDialog mainAction={deleteMutation} section={"lessons"} />,
              }}
              // Pass data and pagination information to the CustomTable component
              data={lessons}
              paginationData={lessonsBySection.pagination}
            >
              {/* Render rows for the lessons table */}
              <LessonRows data={lessons} />
            </CustomTable>
          </ContentLayout>
        </>
      )}
    </>
  );
}

export default LessonsPage;
