import React, { useEffect } from "react";

import { BaseHeaderLayout, ContentLayout, Button } from "@strapi/design-system";
import { CustomAlert, CustomLoader, SectionModal, DeleteDialog } from "../../components";
import { createSectionMutation, updateSectionMutation, deleteSectionMutation } from "../../utils/graphql/mutations/section.mutations";
import { Plus } from "@strapi/icons";
import { usePagination, useModal } from "../../utils";

// Queries
import { useQuery } from "@tanstack/react-query";
import { querySections } from "../../utils/graphql/queries/section.queries";
import { query } from "../../utils/graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../../utils/constants/queryKeys.constants";
import defaultColumns from "./columns";
import CustomTable from "./table";
const formatData = (data) => {
  if (!data) {
    return [];
  }

  return data.map((section) => {
    return {
      id: section.id,
      ...section.attributes,
    };
  });
};
function SectionsPage() {
  // Get current page and rows per page for pagination
  const { currentPage, rowsPerPage } = usePagination();
  const { modalHandler } = useModal();
  const [tableData, setTableData] = React.useState([]);
  // Fetch data for sections using React Query
  const { data, isLoading, error } = useQuery([QUERY_KEYS.sections], () =>
    query(querySections, {
      start: currentPage,
      limit: rowsPerPage,
    })
  );

  useEffect(() => {
    setTableData(formatData(data?.sections?.data));
  }, [data]);

  if (isLoading && !tableData) return <CustomLoader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  return (
    <div style={{ width: "83vw" }}>
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
        <CustomTable data={tableData} columns={defaultColumns()} />
        {modalHandler.type === "create" && <SectionModal mainAction={createSectionMutation} />}
        {modalHandler.type === "edit" && <SectionModal mainAction={updateSectionMutation} />}
        {modalHandler.type === "delete" && <DeleteDialog mainAction={deleteSectionMutation} section={"sections"} />}
      </ContentLayout>
    </div>
  );
}

export default SectionsPage;
