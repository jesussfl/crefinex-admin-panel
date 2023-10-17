import React from "react";
import { Box, Flex, Typography, Tbody, Tr, Td, IconButton } from "@strapi/design-system";

import { Trash, Pencil } from "@strapi/icons";
import { formatReadableDate } from "../../../utils/helpers/formatReadableDate";

import { useModal } from "../../../utils/contexts/ModalContext";
export function ExerciseRows({ data }) {
  const { modalHandler } = useModal();
  return (
    <Tbody>
      {data.map((row) => {
        const attributes = row.attributes;
        return (
          <Tr key={row.id}>
            <Td>
              <Typography textColor="neutral800">{row.id}</Typography>
            </Td>

            <Td>
              <Typography textColor="neutral800">{attributes.type}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{attributes.order}</Typography>
            </Td>
            <Td style={{ whiteSpace: "pre-wrap" }}>
              <Typography textColor="neutral800">{JSON.stringify(attributes.content) || ""}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{formatReadableDate(attributes.createdAt)}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{formatReadableDate(attributes.updatedAt)}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{formatReadableDate(attributes.publishedAt)}</Typography>
            </Td>
            <Td></Td>
            <Td>
              <Flex style={{ justifyContent: "end" }}>
                {/*Enable editing is too hard */}
                {/* <Box paddingLeft={1}>
                  <IconButton
                    onClick={() => {
                      modalHandler.open("edit", row.id, {
                        ...attributes,
                      });
                    }}
                    label="Editar"
                    noBorder
                    icon={<Pencil />}
                  />
                </Box> */}
                <Box paddingLeft={1}>
                  <IconButton onClick={() => modalHandler.open("delete", row.id)} label="Delete" noBorder icon={<Trash />} />
                </Box>
              </Flex>
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
}
