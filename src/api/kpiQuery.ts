import { useMemo } from "react";
import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { getAdhoc } from "./axios";

export interface KPIQueryDef {
  KPI: string;
  definition?: string;
  category?: string;
  query: string;
  keyShown?: string;
}

export interface KPIResult<T = unknown> {
  data: T;
  requiredData: KPIQueryDef;
}

export function useKPIQueries<T = unknown>(
  definitions: KPIQueryDef[] = [],
  enabled = true,
  scopeKey?: string | number
): UseQueryResult<KPIResult<T>>[] {
  const defs = useMemo(() => definitions ?? [], [definitions]);
  const hasDefs = defs.length > 0;

  return useQueries({
    queries: defs.map((def) => ({
      queryKey: ["kpi", scopeKey ?? "default", def?.KPI, def?.query],
      queryFn: () => getAdhoc(def.query) as Promise<T>,
      enabled: enabled && !!def && hasDefs,
      staleTime: 60_000,
      gcTime: 300_000,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 1,
      select: (resp: any): KPIResult<T> => ({
        data: resp?.data,
        requiredData: def,
      }),
    })),
  }) as UseQueryResult<KPIResult<T>>[];
}
