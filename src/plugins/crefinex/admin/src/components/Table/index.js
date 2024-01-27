import React from "react";
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import {
  Button,
  Flex,
  SingleSelect,
  SingleSelectOption,
  Table as StrapiTable,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  TextInput,
  EmptyStateLayout,
  Typography,
} from "@strapi/design-system";
import { useModal } from "../../utils/contexts/ModalContext";
import { Illo } from "../Illo";
import { Plus } from "@strapi/icons";

function Table({ data, columns, emptyStateMessage }) {
  const { modalHandler } = useModal();

  //memoized columns

  const tableColumns = React.useMemo(() => columns, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!data || data.length === 0) {
    return (
      <EmptyStateLayout
        icon={<Illo />}
        content={emptyStateMessage}
        action={
          <Button onClick={() => modalHandler.open("create")} variant="secondary" startIcon={<Plus />}>
            Agregar
          </Button>
        }
      />
    );
  }
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <StrapiTable>
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
      </StrapiTable>
      <Flex justifyContent="space-between" alignItems="flex-end">
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
        <span className="flex items-center gap-1 ">
          <Typography>Página </Typography>
          <Typography>
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </Typography>
        </span>
        <Flex style={{ gap: 4, alignItems: "flex-end", marginTop: "0.8rem" }}>
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
    </div>
  );
}

export default Table;
