import React from "react";
import { Flex, Link, IconButton, Box, Button } from "@strapi/design-system";
import { ROUTES } from "../../utils/constants/routes.constants";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRight, Trash, Pencil, CheckCircle } from "@strapi/icons";
const columnHelper = createColumnHelper();
const defaultColumns = (modalHandler) => {
  return [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("description", {
      header: "Descripción",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("order", {
      header: ({ column }) => {
        return (
          <Button variant="tertiary" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Orden
            {column.getIsSorted() === "desc" ? " ↓" : " ↑"}
          </Button>
        );
      },
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("exercises", {
      header: "Ejercicios",
      cell: (info) => info.getValue().data.length,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("createdAt", {
      header: "Creado",
      cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("updatedAt", {
      header: "Actualizado",
      cell: (info) => {
        return info.getValue() ? new Date(info.getValue()).toLocaleString() : info.getValue();
      },
      footer: (info) => info.column.id,
    }),

    columnHelper.accessor("status", {
      header: "Estado",
      cell: (info) => {
        return info.getValue() === "published" ? (
          <Flex gap={1}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "green" }} color="success" /> Publicado
          </Flex>
        ) : (
          <Flex gap={1}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "gray" }} color="gray" /> En borrador
          </Flex>
        );
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.display({
      header: "Acciones",
      cell: (info) => (
        <>
          <Flex style={{ justifyContent: "end" }}>
            <Link to={ROUTES.EXERCISE(info.row.original.id)}>
              <IconButton label="Go to Exercises" noBorder icon={<ArrowRight />} />
            </Link>
            <Box paddingLeft={1}>
              <IconButton
                onClick={() => modalHandler.open("edit", info.row.original.id, info.row.original)}
                label="Editar"
                noBorder
                icon={<Pencil />}
              />
            </Box>
            <Box paddingLeft={1}>
              <IconButton
                onClick={() => modalHandler.open("status", info.row.original.id, info.row.original.status)}
                label="Publicar"
                noBorder
                icon={<CheckCircle />}
              />
            </Box>
            <Box paddingLeft={1}>
              <IconButton onClick={() => modalHandler.open("delete", info.row.original.id)} label="Eliminar" noBorder icon={<Trash />} />
            </Box>
          </Flex>
        </>
      ),
    }),
  ];
};

export default defaultColumns;
