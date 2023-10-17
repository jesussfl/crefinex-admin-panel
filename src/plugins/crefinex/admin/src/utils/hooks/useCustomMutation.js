import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAlerts } from "../contexts/AlertsContext";
import { query } from "../graphql/client/GraphQLCLient";
import { convertWordToSingular } from "../helpers/convertWordToSingular";
export const useCustomMutation = (queryKey, queryFunction, defaultValues = {}) => {
  const { showAlert } = useAlerts();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const queryClient = useQueryClient();

  const mutate = useMutation(async (payload) => await query(queryFunction, { ...payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      showAlert("success", `${convertWordToSingular(queryKey)}`);
    },
    onError: () => {
      showAlert("error", `there was an error in ${convertWordToSingular(queryKey)}`);
    },
  });

  return {
    control,
    mutate: mutate.mutate,
    handleSubmit,
    watch,
    errors,
  };
};
