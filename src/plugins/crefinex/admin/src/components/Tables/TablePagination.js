import React from "react";
import { Flex, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Pagination, PreviousLink, PageLink, NextLink } from "@strapi/design-system/v2";

// Component for table pagination
export default function TablePagination({ history, currentPage, rowsPerPage, totalPageCount }) {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      {/* Dropdown to select the number of rows per page */}
      <SingleSelect
        placeholder={`Mostrar ${rowsPerPage} filas`}
        onChange={(value) => {
          // Update URL to change the number of rows per page
          history.push(`?page=1&pageSize=${value}&sort=id:ASC`);
        }}
      >
        <SingleSelectOption value={10}>10</SingleSelectOption>
        <SingleSelectOption value={20}>20</SingleSelectOption>
        <SingleSelectOption value={50}>50</SingleSelectOption>
        <SingleSelectOption value={100}>100</SingleSelectOption>
      </SingleSelect>

      {/* Pagination component with page navigation links */}
      <Pagination activePage={currentPage} pageCount={totalPageCount}>
        {currentPage > 1 && <PreviousLink onClick={history.goBack}>Anterior</PreviousLink>}
        {totalPageCount > 1 && currentPage > 3 && (
          <PageLink number={1} onClick={() => history.push(`?page=${1}&pageSize=${rowsPerPage}&sort=id:ASC`)}>
            Ir a la página 1
          </PageLink>
        )}
        {totalPageCount > 1 && currentPage > 4 && <Dots>And 23 other links</Dots>}
        {totalPageCount > 1 && currentPage > 2 && (
          <PageLink number={currentPage - 1} onClick={() => history.push(`?page=${currentPage - 1}&pageSize=${rowsPerPage}&sort=id:ASC`)}>
            Ir a la página {currentPage - 1}
          </PageLink>
        )}
        <PageLink number={currentPage} onClick={() => history.push(`?page=${currentPage}&pageSize=${rowsPerPage}&sort=id:ASC`)}>
          Ir a la página {currentPage}
        </PageLink>
        {totalPageCount > 1 && currentPage < totalPageCount - 1 && (
          <PageLink number={currentPage + 1} onClick={() => history.push(`?page=${currentPage + 1}&pageSize=${rowsPerPage}&sort=id:ASC`)}>
            Ir a la página {currentPage + 1}
          </PageLink>
        )}
        {totalPageCount > 1 && currentPage < totalPageCount - 3 && <Dots>And 23 other links</Dots>}
        {totalPageCount > 1 && currentPage < totalPageCount - 2 && (
          <PageLink number={totalPageCount} onClick={() => history.push(`?page=${totalPageCount}&pageSize=${rowsPerPage}&sort=id:ASC`)}>
            Ir a la página {totalPageCount}
          </PageLink>
        )}
        {currentPage < totalPageCount && (
          <NextLink onClick={() => history.push(`?page=${totalPageCount}&pageSize=${rowsPerPage}&sort=id:ASC`)}>Siguiente</NextLink>
        )}
      </Pagination>
    </Flex>
  );
}
