import React from "react";
import { Flex, Link, IconButton, Box } from "@strapi/design-system";
import { ROUTES } from "../../utils/constants/routes.constants";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRight, Trash, Pencil } from "@strapi/icons";
import { useModal } from "../../utils";
import SectionForm from "./components/form";
const columnHelper = createColumnHelper();
const defaultColumns = () => {
  const { modalHandler } = useModal();

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
    columnHelper.accessor("world", {
      header: "Mundo",
      cell: (info) => info.getValue().data.id,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("order", {
      header: "Orden",
      cell: (info) => info.getValue(),
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
    columnHelper.accessor("publishedAt", {
      header: "Publicado",
      cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : info.getValue()),
      footer: (info) => info.column.id,
    }),
    columnHelper.display({
      header: "Acciones",
      cell: (info) => (
        <>
          <Flex style={{ justifyContent: "end" }}>
            <Link to={ROUTES.LESSON(info.row.original.id)}>
              <IconButton label="Go to Lessons" noBorder icon={<ArrowRight />} />
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
              <IconButton onClick={() => modalHandler.open("delete", info.row.original.id)} label="Eliminar" noBorder icon={<Trash />} />
            </Box>
          </Flex>
        </>
      ),
    }),
  ];
};

export default defaultColumns;
