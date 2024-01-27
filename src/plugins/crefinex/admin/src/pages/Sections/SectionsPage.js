import React from "react";

// Components and icons
import { BaseHeaderLayout, Box, Button, ContentLayout, Layout } from "@strapi/design-system";
import { CustomAlert, Loader, DeleteDialog } from "../../components";
import { Plus } from "@strapi/icons";
import StrapiTable from "../../components/Table";
import SectionForm from "./components/form";

// Utility hooks and functions
import { useModal } from "../../utils";
import { deleteSection } from "../../utils/graphql/mutations/section.mutations";
import { getSections } from "../../utils/data/getData";

// Columns
import defaultColumns from "./columns";

function SectionsPage() {
  const { modalHandler, showModal, defaultValues } = useModal();
  const { sections, isLoading, error } = getSections();

  if (isLoading && !sections) return <Loader />;
  if (error) return <CustomAlert data={{ type: "error", message: error.name }} />;
  return (
    <Box>
      <Layout>
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
          <StrapiTable data={sections} columns={defaultColumns()} />
          {showModal && <SectionForm defaultValues={defaultValues} />}
          {modalHandler.type === "delete" && <DeleteDialog mainAction={deleteSection} section={"sections"} />}
        </ContentLayout>
      </Layout>
    </Box>
  );
}

export default SectionsPage;
