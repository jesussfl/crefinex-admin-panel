import React from "react";
import { Box, Flex, Typography, Tbody, Tr, Td, IconButton } from "@strapi/design-system";

import { Trash } from "@strapi/icons";
import { formatReadableDate } from "../../../utils/formatReadableDate";

import { useModal } from "../../../utils/contexts/ModalContext";
export function ExerciseRows({ data }) {
  const { setIdToDelete } = useModal();
  return (
    <Tbody>
      {data.map((row) => {
        const attributes = row.attributes;
        console.log(attributes.content);
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
            <Td>
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
                <Box paddingLeft={1}>
                  <IconButton onClick={() => setIdToDelete(row.id)} label="Delete" noBorder icon={<Trash />} />
                </Box>
              </Flex>
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  );
}
