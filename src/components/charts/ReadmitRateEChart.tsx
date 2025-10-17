import React, { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { getAdhoc } from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface Props {
  title?: string;
  target?: number; // default 10
}

const PCT_SQL =
  "WITH e AS (SELECT patient_id, encounter_id, CASE WHEN admission_datetime IS NOT NULL AND TRIM(CAST(admission_datetime AS CHAR)) <> '' THEN FROM_UNIXTIME(CAST(admission_datetime AS UNSIGNED)/1000) ELSE FROM_UNIXTIME(CAST(arrival_datetime AS UNSIGNED)/1000) END AS admit_dt, CASE WHEN discharge_datetime IS NOT NULL AND TRIM(CAST(discharge_datetime AS CHAR)) <> '' THEN FROM_UNIXTIME(CAST(discharge_datetime AS UNSIGNED)/1000) ELSE NULL END AS discharge_dt, LOWER(TRIM(CAST(type AS CHAR))) AS enc_type, LOWER(TRIM(CAST(disposition AS CHAR))) AS disposition FROM t_68d13dfca01e732ba3149aa6_t), seq AS (SELECT e.*, LEAD(admit_dt) OVER (PARTITION BY patient_id ORDER BY admit_dt) AS next_admit_dt, LEAD(enc_type) OVER (PARTITION BY patient_id ORDER BY admit_dt) AS next_enc_type FROM e), eligible AS (SELECT * FROM seq WHERE enc_type = 'inpatient' AND discharge_dt IS NOT NULL AND (disposition IS NULL OR disposition NOT IN ('expired','death','deceased'))), agg AS (SELECT COUNT(*) AS index_inpatient_discharges, SUM(CASE WHEN next_admit_dt IS NOT NULL AND next_admit_dt > discharge_dt AND next_admit_dt <= discharge_dt + INTERVAL 30 DAY AND (next_enc_type = 'inpatient') THEN 1 ELSE 0 END) AS readmitted_within_30d FROM eligible) SELECT readmitted_within_30d, index_inpatient_discharges, ROUND(100.0 * readmitted_within_30d / NULLIF(index_inpatient_discharges, 0), 2) AS readmit_rate_pct FROM agg;";

const TREND_SQL =
  "WITH e AS (SELECT patient_id, encounter_id, CASE WHEN admission_datetime IS NOT NULL AND TRIM(CAST(admission_datetime AS CHAR)) <> '' THEN FROM_UNIXTIME(CAST(admission_datetime AS UNSIGNED)/1000) ELSE FROM_UNIXTIME(CAST(arrival_datetime AS UNSIGNED)/1000) END AS admit_dt, CASE WHEN discharge_datetime IS NOT NULL AND TRIM(CAST(discharge_datetime AS CHAR)) <> '' THEN FROM_UNIXTIME(CAST(discharge_datetime AS UNSIGNED)/1000) ELSE NULL END AS discharge_dt, LOWER(TRIM(CAST(type AS CHAR))) AS enc_type, LOWER(TRIM(CAST(disposition AS CHAR))) AS disposition FROM t_68d13dfca01e732ba3149aa6_t), seq AS (SELECT e.*, LEAD(admit_dt) OVER (PARTITION BY patient_id ORDER BY admit_dt) AS next_admit_dt, LEAD(enc_type) OVER (PARTITION BY patient_id ORDER BY admit_dt) AS next_enc_type FROM e), eligible AS (SELECT * FROM seq WHERE enc_type='inpatient' AND discharge_dt IS NOT NULL AND (disposition IS NULL OR disposition NOT IN ('expired','death','deceased'))), daily AS (SELECT DATE(discharge_dt) AS discharge_date, COUNT(*) AS index_inpatient_discharges, SUM(CASE WHEN next_admit_dt IS NOT NULL AND next_admit_dt>discharge_dt AND next_admit_dt<=discharge_dt+INTERVAL 30 DAY AND next_enc_type='inpatient' THEN 1 ELSE 0 END) AS readmitted_within_30d FROM eligible GROUP BY DATE(discharge_dt)) SELECT discharge_date, ROUND(100.0 * readmitted_within_30d / NULLIF(index_inpatient_discharges, 0), 2) AS readmit_rate_pct FROM daily ORDER BY discharge_date;";

export const ReadmitRateEChart: React.FC<Props> = ({ title = "30-Day Readmit Rate", target = 10 }) => {
  const pctQ = useQuery({
    queryKey: ["readmit", "pct"],
    queryFn: () => getAdhoc(PCT_SQL),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const trendQ = useQuery({
    queryKey: ["readmit", "trend"],
    queryFn: () => getAdhoc(TREND_SQL),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  const pctValue: number | null = useMemo(() => {
    const rows = (pctQ.data as any)?.data ?? pctQ.data;
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    return row && (row.readmit_rate_pct ?? row.READMIT_RATE_PCT) != null
      ? Number(row.readmit_rate_pct ?? row.READMIT_RATE_PCT)
      : null;
  }, [pctQ.data]);

  const chartData = useMemo(() => {
    const rows = (trendQ.data as any)?.data ?? trendQ.data;
    if (!Array.isArray(rows)) return [] as { date: string; value: number }[];
    return rows.map((r: any) => ({
      date: r.discharge_date ?? r.DISCHARGE_DATE,
      value: Number(r.readmit_rate_pct ?? r.READMIT_RATE_PCT ?? 0),
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

  const isMetTarget = pctValue != null ? pctValue <= target : false; // lower is better

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
        {isError && <div>Error loading readmit rate</div>}
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

export default ReadmitRateEChart;
