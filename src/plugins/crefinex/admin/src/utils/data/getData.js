import { useQuery } from "@tanstack/react-query";
import { query } from "../graphql/client/GraphQLCLient";
import { QUERY_KEYS } from "../constants/queryKeys.constants";
import { querySections, querySectionsByWorld } from "../graphql/queries/section.queries";
import { queryLessonsBySectionId } from "../graphql/queries/lesson.queries";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatData } from "../helpers/reduceAttributesFromData";
import { queryExercisesByLesson } from "../graphql/queries/exercise.queries";
import { queryWorlds } from "../graphql/queries/world.queries";

const findAll = async (queryFn, start, limit) => {
  return await query(queryFn, { start, limit });
};

const findById = (queryFn, id, start, limit) => {
  return query(queryFn, { id, start, limit });
};
export const getWorlds = () => {
  const [worlds, setWorlds] = useState([]);
  const [pagination, setPagination] = useState({});
  const { data, isLoading, error } = useQuery([QUERY_KEYS.worlds], () => query(queryWorlds), {
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    setWorlds(formatData(data?.crefinexWorlds?.data));
    console.log(data?.crefinexWorlds);
    setPagination(data?.crefinexWorlds?.meta?.pagination);
  }, [data]);
  return {
    worlds,
    pagination,
    isLoading,
    error,
  };
};
export const getSections = () => {
  const [sections, setSections] = useState([]);
  const [pagination, setPagination] = useState({});
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));
  const { data, isLoading, error } = useQuery([QUERY_KEYS.sections], async () => findAll(querySections, start, limit), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setSections(formatData(data?.sections?.data));
    setPagination(data?.sections?.meta?.pagination);
  }, [data]);

  return {
    sections,
    pagination,
    isLoading,
    error,
  };
};

export const getSectionsByWorld = (worldId) => {
  const [sections, setSections] = useState([]);
  const [pagination, setPagination] = useState({});
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));

  const { data, isLoading, error } = useQuery([QUERY_KEYS.sections], () => findById(querySectionsByWorld, worldId, start, limit));

  useEffect(() => {
    console.log(data);
    setSections(formatData(data?.sectionsByWorldId?.sections));
    setPagination(data?.sectionsByWorldId?.pagination);
  }, [data]);

  return {
    pagination,
    sections,
    isLoading,
    error,
  };
};

export const getLessonsBySection = (sectionId) => {
  const [lessons, setLessons] = useState([]);
  const [pagination, setPagination] = useState({});
  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));

  const { data, isLoading, error } = useQuery([QUERY_KEYS.lessons], () => findById(queryLessonsBySectionId, sectionId, start, limit));

  useEffect(() => {
    setLessons(formatData(data?.lessonsBySection?.lessons));
    setPagination(data?.lessonsBySection?.pagination);
  }, [data]);

  return {
    pagination,
    lessons,
    isLoading,
    error,
  };
};

export const getExercisesByLesson = (lessonId) => {
  const [exercises, setExercises] = useState([]);
  const [pagination, setPagination] = useState({});

  const search = useLocation().search;
  const params = new URLSearchParams(search);
  const start = Number(params.get("page"));
  const limit = Number(params.get("pageSize"));

  const { data, isLoading, error } = useQuery([QUERY_KEYS.exercises], () => findById(queryExercisesByLesson, lessonId, start, limit));

  useEffect(() => {
    setExercises(formatData(data?.exercisesByLesson?.exercises));
    setPagination(data?.exercisesByLesson?.pagination);
  }, [data]);

  return {
    pagination,
    exercises,
    isLoading,
    error,
  };
};
