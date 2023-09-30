import React from "react";
import { Typography, VisuallyHidden, Thead, Tr, Th } from "@strapi/design-system";

const headerTranslations = {
  // You can add translations for headers as needed
  id: "ID",
  name: "Nombre",
  description: "Descripción",
  createdAt: "Creado",
  updatedAt: "Actualizado",
  publishedAt: "Publicado",
  lessons: "Lecciones",
  exercises: "Ejercicios",
  type: "Tipo",
  order: "Orden",
  content: "Contenido",
  world: "Mundo",
  // ... Add more translations as needed
};

export default function TableHeaders({ data }) {
  const headers = Object.keys(data[0]?.attributes) || [];

  return (
    <Thead>
      <Tr>
        <Th>
          <Typography variant="sigma">ID</Typography>
        </Th>
        {headers.map((header, index) => (
          <Th key={index}>
            <Typography variant="sigma">{headerTranslations[header] || header}</Typography>
          </Th>
        ))}
        <Th>
          <VisuallyHidden>Acciones</VisuallyHidden>
        </Th>
      </Tr>
    </Thead>
  );
}
