import React, { useEffect, useState } from "react";

import { BaseHeaderLayout, ContentLayout, Button } from "@strapi/design-system";
import { CustomAlert, CustomLoader, SectionModal, DeleteDialog } from "../../components";
import { createSectionMutation, updateSectionMutation, deleteSectionMutation } from "../../utils/graphql/mutations/section.mutations";
import { Plus } from "@strapi/icons";
import { usePagination, useModal } from "../../utils";

import defaultColumns from "./columns";
import CustomTable from "../../components/table";
import { formatData } from "../../utils/helpers/reduceAttributesFromData";

import { useGetSections } from "../../utils/hooks/useFetchData";
function SectionsPage() {
  const [tableData, setTableData] = useState([]);

  const { currentPage, rowsPerPage } = usePagination();
  const { modalHandler } = useModal();
  const { data, isLoading, error } = useGetSections(currentPage, rowsPerPage);

  useEffect(() => {
    setTableData(formatData(data?.sections?.data));
  }, [data]);

  if (isLoading && !tableData) return <CustomLoader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  return (
    <div style={{ width: "83vw", marginBottom: "48px" }}>
      <BaseHeaderLayout
        title="Secciones"
        subtitle="Aquí podrás añadir las secciones de los mundos creados."
        as="h2"
        primaryAction={
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
