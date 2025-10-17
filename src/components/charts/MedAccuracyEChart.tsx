import React, { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { getAdhoc } from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface Props {
  title?: string;
  target?: number; // default 99.5
}

const PCT_SQL =
  "SELECT SUM( CASE WHEN ( (BCMA_compliance = 1) OR LOWER(TRIM(CAST(BCMA_compliance AS CHAR))) IN ('true','t','yes','y','1') ) AND LOWER(TRIM(CAST(reconciliation_status AS CHAR))) = 'completed' THEN 1 ELSE 0 END ) AS compliant_cnt, COUNT(med_id) AS total_cnt, ROUND( 100.0 * SUM(CASE WHEN ((BCMA_compliance = 1) OR LOWER(TRIM(CAST(BCMA_compliance AS CHAR))) IN ('true','t','yes','y','1')) AND LOWER(TRIM(CAST(reconciliation_status AS CHAR))) = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(med_id), 0) , 3) AS med_accuracy_pct, CASE WHEN 100.0 * SUM(CASE WHEN ((BCMA_compliance = 1) OR LOWER(TRIM(CAST(BCMA_compliance AS CHAR))) IN ('true','t','yes','y','1')) AND LOWER(TRIM(CAST(reconciliation_status AS CHAR))) = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(med_id), 0) >= 99.5 THEN 'Meets Target' ELSE 'Below Target' END AS status FROM t_68d13e43a01e732ba3149aa8_t;";

const TREND_SQL =
  "SELECT DATE(FROM_UNIXTIME(CASE WHEN LENGTH(administered_timestamp)=13 THEN administered_timestamp/1000 WHEN LENGTH(administered_timestamp)=10 THEN administered_timestamp ELSE UNIX_TIMESTAMP(STR_TO_DATE(administered_timestamp, '%Y-%m-%d %H:%i:%s')) END)) AS med_date, ROUND(100.0 * SUM(CASE WHEN ((BCMA_compliance=1) OR LOWER(TRIM(CAST(BCMA_compliance AS CHAR))) IN ('true','t','yes','y','1')) AND LOWER(TRIM(CAST(reconciliation_status AS CHAR)))='completed' THEN 1 ELSE 0 END)/NULLIF(COUNT(med_id),0),3) AS med_accuracy_pct FROM t_68d13e43a01e732ba3149aa8_t GROUP BY med_date ORDER BY med_date;";

export const MedAccuracyEChart: React.FC<Props> = ({ title = "Med Accuracy (BCMA)", target = 99.5 }) => {
  const pctQ = useQuery({
    queryKey: ["bcma", "pct"],
    queryFn: () => getAdhoc(PCT_SQL),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const trendQ = useQuery({
    queryKey: ["bcma", "trend"],
    queryFn: () => getAdhoc(TREND_SQL),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const pctValue: number | null = useMemo(() => {
    const rows = (pctQ.data as any)?.data ?? pctQ.data;
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    return row && (row.med_accuracy_pct ?? row.MED_ACCURACY_PCT) != null
      ? Number(row.med_accuracy_pct ?? row.MED_ACCURACY_PCT)
      : null;
  }, [pctQ.data]);

  const chartData = useMemo(() => {
    const rows = (trendQ.data as any)?.data ?? trendQ.data;
    if (!Array.isArray(rows)) return [] as { date: string; value: number }[];
    return rows.map((r: any) => ({
      date: r.med_date ?? r.MED_DATE,
      value: Number(r.med_accuracy_pct ?? r.MED_ACCURACY_PCT ?? 0),
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
          symbol: "none",
          lineStyle: { width: 2, color: "#0d9488" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(13,148,136,0.45)" },
              { offset: 1, color: "rgba(13,148,136,0.08)" },
            ]),
          },
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
        {isError && <div>Error loading med accuracy</div>}
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

export default MedAccuracyEChart;
