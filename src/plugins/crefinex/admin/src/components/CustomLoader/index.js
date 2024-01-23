import React from "react";
import { Flex, Loader as StrapiLoader } from "@strapi/design-system";
export default function Loader() {
  return (
    <Flex
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <StrapiLoader>Loading...</StrapiLoader>
    </Flex>
  );
}
