import React from "react";
import { Flex, Table, TFooter } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { usePagination } from "../../utils/hooks/usePagination";
import { TableFilters, TablePagination, EmptyState, TableHeaders } from "..";
import { useModal } from "../../utils/contexts/ModalContext";
export default function CustomTable({ config, data, paginationData, children }) {
  const { modalHandler } = useModal();
  const { currentPage, rowsPerPage, history } = usePagination();

  const isDataEmpty = data.length === 0;

  if (isDataEmpty) return <EmptyState renderActionModal={config.createModal} message={config.emptyStateMessage} />;

  return (
    <Flex gap={4} direction="column" alignItems="stretch">
      <TableFilters />
      <Table
        colCount={6}
        rowCount={rowsPerPage}
        footer={
          <TFooter onClick={() => modalHandler.open("create")} icon={<Plus />}>
            Añadir entrada
          </TFooter>
        }
      >
        <TableHeaders data={data} />

        {children}
      </Table>
      <TablePagination
        history={history}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalPageCount={paginationData?.pageCount || 1}
      />

      {modalHandler.type === "create" && config.createModal()}
      {modalHandler.type === "edit" && config.editModal()}
      {modalHandler.type === "delete" && config.deleteDialog()}
    </Flex>
  );
}
