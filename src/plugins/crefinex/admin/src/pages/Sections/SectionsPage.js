import React from "react";

import { BaseHeaderLayout, ContentLayout, Button } from "@strapi/design-system";
import { CustomAlert, CustomLoader, SectionModal, DeleteDialog, CustomTable } from "../../components";
import { SectionRows } from "../../components/Tables/Rows/SectionRows";
import {
  createSectionMutation as createMutation,
  updateSectionMutation as updateMutation,
  deleteSectionMutation as deleteMutation,
} from "../../utils/graphql/mutations/section.mutations";

import { Plus } from "@strapi/icons";
import { usePagination, useModal } from "../../utils";

// Queries
import { useQuery } from "@tanstack/react-query";
import { querySections } from "../../utils/graphql/queries/section.queries";
import { query } from "../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../utils/constants/queryKeys.constants";

function SectionsPage() {
  // Get current page and rows per page for pagination
  const { currentPage, rowsPerPage } = usePagination();
  const { modalHandler } = useModal();

  // Fetch data for sections using React Query
  const { data, isLoading, error } = useQuery([QUERY_KEYS.sections, currentPage, rowsPerPage], () =>
    query(querySections, {
      start: currentPage,
      limit: rowsPerPage,
    })
  );
  const { sections } = isLoading ? {} : data;

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
            title="Secciones"
            subtitle="Aquí podrás añadir las secciones de los mundos creados."
            as="h2"
            primaryAction={
              // Button to open a modal for adding a new section
              <Button startIcon={<Plus />} onClick={() => modalHandler.open("create")}>
                Añadir sección
              </Button>
            }
          />
          <ContentLayout>
            <CustomTable
              config={{
                tableName: "sections",
                emptyStateMessage: "No hay secciones aún",
                createModal: () => <SectionModal mainAction={createMutation} />,
                editModal: () => <SectionModal mainAction={updateMutation} />,
                deleteDialog: () => <DeleteDialog mainAction={deleteMutation} section={"sections"} />,
              }}
              // Pass data and pagination information to the CustomTable component
              data={sections.data}
              paginationData={sections.meta.pagination}
            >
              {/* Render rows for the sections table */}
              <SectionRows data={sections.data} />
            </CustomTable>
          </ContentLayout>
        </>
      )}
    </>
  );
}

export default SectionsPage;
