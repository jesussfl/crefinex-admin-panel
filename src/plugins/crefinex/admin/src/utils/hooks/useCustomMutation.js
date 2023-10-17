import { useForm } from "react-hook-form";

export const useCustomMutation = (defaultValues = {}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  return {
    control,
    handleSubmit,
    watch,
    errors,
  };
};
