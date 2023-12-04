import React, { useEffect } from "react";

// Importing components and icons
import { BaseHeaderLayout, ContentLayout, Button, Link, Breadcrumbs, Crumb } from "@strapi/design-system";
import { Plus, ArrowLeft } from "@strapi/icons";
import { CustomAlert, CustomLoader, LessonModal, DeleteDialog } from "../../components";

// Importing utility hooks and functions
import { useModal, usePagination } from "../../utils";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/constants/queryKeys.constants";
import { query } from "../../utils/graphql/client/GraphQLCLient";
import { queryLessonsBySectionId } from "../../utils/graphql/queries/lesson.queries";
import {
  createLessonMutation as createMutation,
  updateLessonMutation as updateMutation,
  deleteLessonMutation as deleteMutation,
} from "../../utils/graphql/mutations/lesson.mutations";
import { formatData } from "../../utils/helpers/reduceAttributesFromData";
import CustomTable from "../../components/table";
import defaultColumns from "./columns";

function LessonsPage() {
  const history = useHistory();
  const { sectionId } = useParams();
  const { modalHandler } = useModal();
  const { currentPage, rowsPerPage } = usePagination();
  const [tableData, setTableData] = React.useState([]);

  const { data, isLoading, error } = useQuery([QUERY_KEYS.lessons, sectionId], () =>
    query(queryLessonsBySectionId, { id: sectionId, start: currentPage, limit: rowsPerPage })
  );
  useEffect(() => {
    console.log(formatData(data?.lessonsBySection?.lessons));
    setTableData(formatData(data?.lessonsBySection?.lessons));
  }, [data]);

  const { lessonsBySection } = isLoading ? {} : data;
  const sectionInfo = lessonsBySection?.section;

  const world = lessonsBySection?.section?.world?.data?.attributes?.name;

  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  if (isLoading) return <CustomLoader />;
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
