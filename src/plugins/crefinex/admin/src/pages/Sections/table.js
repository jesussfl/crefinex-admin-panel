import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  PaginationState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button, Flex, SingleSelect, SingleSelectOption, Table, Thead, Tr, Th, Td, Tbody, TFooter, TextInput } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { Pagination, PreviousLink, PageLink, NextLink } from "@strapi/design-system/v2";

function CustomTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <>
      <Table
        footer={
          <TFooter onClick={() => modalHandler.open("create")} icon={<Plus />}>
            Añadir entrada
          </TFooter>
        }
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between">
        <Flex style={{ gap: 4 }}>
          <Button className="border rounded p-1" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            {"<<"}
          </Button>
          <Button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {"<"}
          </Button>
          <Button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {">"}
          </Button>
          <Button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </Flex>
        <span className="flex items-center gap-1">
          <div>Página</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </strong>
        </span>
        <Flex style={{ gap: 4, alignItems: "center" }}>
          <TextInput
            label="Ir a la pagina"
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
          <SingleSelect
            value={table.getState().pagination.pageSize}
            onChange={(value) => {
              table.setPageSize(Number(value));
              // history.push(`?page=1&pageSize=${value}&sort=id:ASC`);
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SingleSelectOption key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </Flex>
      </Flex>
    </>
  );
}

export default CustomTable;
