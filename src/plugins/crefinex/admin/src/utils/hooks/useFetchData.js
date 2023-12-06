import { useQuery } from "@tanstack/react-query";
import { query } from "../graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../constants/queryKeys.constants";
import { querySections } from "../graphql/queries/section.queries";
import { queryLessonsBySectionId } from "../graphql/queries/lesson.queries";

const findAll = (queryFn, start, limit) => {
  return query(queryFn, { start, limit });
};

const findById = (queryFn, id, start, limit) => {
  return query(queryFn, { id, start, limit });
};

export const useGetSections = (start, limit) => {
  return useQuery([QUERY_KEYS.sections], () => findAll(querySections, start, limit));
};

export const useGetLessonsBySection = (id, start, limit) => {
  return useQuery([QUERY_KEYS.lessons], () => findById(queryLessonsBySectionId, id, start, limit));
};
