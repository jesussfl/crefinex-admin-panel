import React, { useEffect, useState } from "react";

// Importing components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb } from "@strapi/design-system";
import { Plus, ArrowLeft } from "@strapi/icons";
import { CustomAlert, CustomLoader, LessonModal, DeleteDialog } from "../../components";

// Importing utility hooks and functions
import { useModal, usePagination } from "../../utils";
import { useParams, useHistory } from "react-router-dom";

import {
  createLessonMutation as createMutation,
  updateLessonMutation as updateMutation,
  deleteLessonMutation as deleteMutation,
} from "../../utils/graphql/mutations/lesson.mutations";
import { formatData } from "../../utils/helpers/reduceAttributesFromData";
import CustomTable from "../../components/table";
import defaultColumns from "./columns";
import { useGetLessonsBySection } from "../../utils/hooks/useFetchData";
function LessonsPage() {
  const [tableData, setTableData] = useState([]);

  const history = useHistory();
  const { sectionId } = useParams();
  const { modalHandler } = useModal();
  const { currentPage, rowsPerPage } = usePagination();
  const { data, isLoading, error } = useGetLessonsBySection(sectionId, currentPage, rowsPerPage);

  useEffect(() => {
    setTableData(formatData(data?.lessonsBySection?.lessons));
  }, [data]);

  const { lessonsBySection } = isLoading ? {} : data;
  const sectionInfo = lessonsBySection?.section;

  const world = lessonsBySection?.section?.world?.data?.attributes?.name;

  if (isLoading) return <CustomLoader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  return (
    <div style={{ width: "83vw", marginBottom: "48px" }}>
      <BaseHeaderLayout
        navigationAction={
          <Link startIcon={<ArrowLeft />} onClick={() => history.goBack()}>
            Volver
          </Link>
        }
        primaryAction={
          <Button startIcon={<Plus />} onClick={() => modalHandler.open("create")}>
            Añadir una lección
          </Button>
        }
        title="Lecciones"
        subtitle={
          <Breadcrumbs label="folders">
            <Crumb>{`Mundo: ${world}`}</Crumb>
            <Crumb>{`Sección: ${lessonsBySection.section?.description} (ID: ${sectionId})`}</Crumb>
          </Breadcrumbs>
        }
        as="h2"
      />
      <ContentLayout>
        <CustomTable data={tableData} columns={defaultColumns()} />
        {modalHandler.type === "create" && <LessonModal mainAction={createMutation} sectionInfo={sectionInfo} sectionId={sectionId} />}
        {modalHandler.type === "edit" && <LessonModal sectionInfo={sectionInfo} sectionId={sectionId} mainAction={updateMutation} />}
        {modalHandler.type === "delete" && <DeleteDialog mainAction={deleteMutation} section={"lessons"} />}
      </ContentLayout>
    </div>
  );
}

export default LessonsPage;
