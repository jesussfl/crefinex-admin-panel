import React from "react";
import { Box, Flex, Typography, Tbody, Tr, Td, IconButton, Link } from "@strapi/design-system";
import { ArrowRight, Trash, Pencil } from "@strapi/icons";
import { useModal } from "../../../utils";
import { ROUTES } from "../../../utils/constants/routes.constants";
import { formatReadableDate } from "../../../utils/helpers/formatReadableDate";

export function LessonRows({ data }) {
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
              <Typography textColor="neutral800">{attributes.description}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{attributes.order}</Typography>
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
            <Td>
              <Typography textColor="neutral800">{attributes.exercises.data.length}</Typography>
            </Td>
            <Td>
              <Flex style={{ justifyContent: "end" }}>
                <Link to={ROUTES.EXERCISE(row.id)}>
                  <IconButton label="Go to Exercises" noBorder icon={<ArrowRight />} />
                </Link>
                <Box paddingLeft={1}>
                  <IconButton
                    onClick={() => {
                      modalHandler.open("edit", row.id, {
                        ...attributes,
                      });
                    }}
                    label="Edit"
                    noBorder
                    icon={<Pencil />}
                  />
                </Box>
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
