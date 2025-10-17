import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInstance } from "./axios";

export const useGetInstanceQuery = (schemaId: string, enabled = true) =>
  useQuery({
    queryKey: ["getInstance", schemaId],
    queryFn: () => getInstance(schemaId, {}),
    enabled: !!schemaId && enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useInvalidateInstance = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["getInstance"] });
};
