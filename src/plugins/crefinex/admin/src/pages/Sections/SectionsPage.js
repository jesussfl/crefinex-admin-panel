import React from "react";

import { BaseHeaderLayout, ContentLayout, Button } from "@strapi/design-system";
import { CustomAlert, CustomLoader, SectionModal, DeleteDialog, CustomTable } from "../../components";
import { SectionRows } from "../../components/Tables/Rows/SectionRows";
import { createSectionMutation, updateSectionMutation, deleteSectionMutation } from "../../utils/graphql/mutations/section.mutations";

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

  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  if (isLoading && !data) return <CustomLoader />;
  return (
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
            createModal: () => <SectionModal mainAction={createSectionMutation} />,
            editModal: () => <SectionModal mainAction={updateSectionMutation} />,
            deleteDialog: () => <DeleteDialog mainAction={deleteSectionMutation} section={"sections"} />,
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
  );
}

export default SectionsPage;
