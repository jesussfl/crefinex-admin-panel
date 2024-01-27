import { useQuery } from "@tanstack/react-query";
import { query } from "../graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../constants/queryKeys.constants";
import { querySections } from "../graphql/queries/section.queries";
import { queryLessonsBySectionId } from "../graphql/queries/lesson.queries";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatData } from "../helpers/reduceAttributesFromData";
import { queryExercisesByLesson } from "../graphql/queries/exercise.queries";

const findAll = (queryFn, start, limit) => {
  return query(queryFn, { start, limit });
};

const findById = (queryFn, id, start, limit) => {
  return query(queryFn, { id, start, limit });
};

export const getSections = () => {
  const [sections, setSections] = useState([]);
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));
  const { data, isLoading, error } = useQuery([QUERY_KEYS.sections], () => findAll(querySections, start, limit));

  useEffect(() => {
    setSections(formatData(data?.sections?.data));
  }, [data]);

  return {
    sections,
    isLoading,
    error,
  };
};

export const getLessonsBySection = (sectionId) => {
  const [lessons, setLessons] = useState([]);

  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));

  const { data, isLoading, error } = useQuery([QUERY_KEYS.lessons], () => findById(queryLessonsBySectionId, sectionId, start, limit));

  useEffect(() => {
    setLessons(formatData(data?.lessonsBySection?.lessons));
  }, [data]);

  return {
    lessons,
    isLoading,
    error,
  };
};

export const getExercisesByLesson = (lessonId) => {
  const [exercises, setExercises] = useState([]);

  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));

  const { data, isLoading, error } = useQuery([QUERY_KEYS.exercises], () => findById(queryExercisesByLesson, lessonId, start, limit));

  useEffect(() => {
    setExercises(formatData(data?.exercisesByLesson?.exercises));
  }, [data]);

  return {
    exercises,
    isLoading,
    error,
  };
};
