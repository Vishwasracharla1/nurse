import React, { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { getAdhoc } from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface Props {
  title?: string;
  target?: number; // default 90
}

const PCT_SQL =
  "SELECT SUM(CASE WHEN TIME(discharge_dt) <= '12:00:00' THEN 1 ELSE 0 END) AS before_noon_cnt, COUNT(*) AS total_discharge_cnt, ROUND(100.0 * SUM(CASE WHEN TIME(discharge_dt) <= '12:00:00' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS discharge_before_noon_pct, CASE WHEN 100.0 * SUM(CASE WHEN TIME(discharge_dt) <= '12:00:00' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) >= 90 THEN 'Meets Target' ELSE 'Below Target' END AS status FROM (SELECT FROM_UNIXTIME(CAST(discharge_datetime AS UNSIGNED)/1000) AS discharge_dt FROM t_68d13dfca01e732ba3149aa6_t WHERE discharge_datetime IS NOT NULL AND TRIM(CAST(discharge_datetime AS CHAR)) <> '') d;";

const TREND_SQL =
  "SELECT DATE(FROM_UNIXTIME(CAST(discharge_datetime AS UNSIGNED)/1000)) AS discharge_date, ROUND(100.0 * SUM(CASE WHEN TIME(FROM_UNIXTIME(CAST(discharge_datetime AS UNSIGNED)/1000)) <= '12:00:00' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS discharge_before_noon_pct FROM t_68d13dfca01e732ba3149aa6_t WHERE discharge_datetime IS NOT NULL AND TRIM(CAST(discharge_datetime AS CHAR)) <> '' GROUP BY discharge_date ORDER BY discharge_date;";

export const DischargeBeforeNoonEChart: React.FC<Props> = ({ title = "Discharge Before Noon", target = 90 }) => {
  const pctQ = useQuery({
    queryKey: ["discharge_noon", "pct"],
    queryFn: () => getAdhoc(PCT_SQL),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const trendQ = useQuery({
    queryKey: ["discharge_noon", "trend"],
    queryFn: () => getAdhoc(TREND_SQL),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const pctValue: number | null = useMemo(() => {
    const rows = (pctQ.data as any)?.data ?? pctQ.data;
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    return row && (row.discharge_before_noon_pct ?? row.DISCHARGE_BEFORE_NOON_PCT) != null
      ? Number(row.discharge_before_noon_pct ?? row.DISCHARGE_BEFORE_NOON_PCT)
      : null;
  }, [pctQ.data]);

  const chartData = useMemo(() => {
    const rows = (trendQ.data as any)?.data ?? trendQ.data;
    if (!Array.isArray(rows)) return [] as { date: string; value: number }[];
    return rows.map((r: any) => ({
      date: r.discharge_date ?? r.DISCHARGE_DATE,
      value: Number(r.discharge_before_noon_pct ?? r.DISCHARGE_BEFORE_NOON_PCT ?? 0),
    }));
  }, [trendQ.data]);

  useEffect(() => {
    if (!ref.current) return;

    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current, undefined, { renderer: "canvas" });
    }

    if (!chartData || chartData.length === 0) {
      chartRef.current.clear();
      return;
    }

    const x = chartData.map((d) => d.date);
    const y = chartData.map((d) => d.value);

    const option: echarts.EChartsOption = {
      grid: { left: 44, right: 20, top: 24, bottom: 30 },
      tooltip: { trigger: "axis", axisPointer: { type: "line" } },
      xAxis: { type: "category", data: x, boundaryGap: false },
      yAxis: { type: "value", min: 0, max: 100 },
      series: [
        {
          name: "Actual",
          type: "line",
          data: y,
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 3, color: "#0d9488" },
          itemStyle: { color: "#0d9488" },
          areaStyle: { color: "rgba(13, 148, 136, 0.08)" },
          markLine: {
            symbol: "none",
            label: { show: true, formatter: "Target" },
            data: [{ yAxis: target }],
            lineStyle: { type: "dashed", color: "#f59e0b" },
          },
        },
      ],
      animationDuration: 400,
    };

    chartRef.current.setOption(option);

    const handleResize = () => chartRef.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [chartData, target]);

  const isLoading = pctQ.isLoading || trendQ.isLoading;
  const isError = pctQ.isError || trendQ.isError;

  const isMetTarget = pctValue != null ? pctValue >= target : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {pctValue != null && (
            <Badge variant={isMetTarget ? "success" : "warning"}>
              {isMetTarget ? "On Track" : "At Risk"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div>Loading…</div>}
        {isError && <div>Error loading discharge before noon</div>}
        {!isLoading && !isError && (
          <>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {pctValue != null ? `${pctValue}%` : "--"}
              </div>
              <div className="text-sm text-gray-600">Target: {target}%</div>
            </div>
            <div ref={ref} className="w-full h-[200px]" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DischargeBeforeNoonEChart;
