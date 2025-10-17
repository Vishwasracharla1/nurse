import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useKPIQueries, KPIQueryDef } from '../../api/kpiQuery';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend } from 'recharts';

interface Props {
  title?: string;
  target?: number; // percentage target, e.g., 95
}

const PCT_SQL =
  "SELECT ROUND( 100.0 * COUNT(DISTINCT CASE WHEN ( (last_vitals_timestamp REGEXP '^[0-9]{13}$') OR (last_vitals_timestamp REGEXP '^[0-9]{10}$') OR (INSTR(last_vitals_timestamp, 'T') > 0) OR (STR_TO_DATE(last_vitals_timestamp, '%Y-%m-%d %H:%i:%s') IS NOT NULL) ) THEN patient_id END) / NULLIF(COUNT(DISTINCT patient_id), 0) , 2) AS pct_with_any_vitals FROM t_68d13cb9a01e732ba3149aa3_t;";

const TREND_SQL =
  "SELECT DATE(FROM_UNIXTIME(CASE WHEN LENGTH(last_vitals_timestamp)=13 THEN last_vitals_timestamp/1000 WHEN LENGTH(last_vitals_timestamp)=10 THEN last_vitals_timestamp ELSE UNIX_TIMESTAMP(STR_TO_DATE(last_vitals_timestamp,'%Y-%m-%d %H:%i:%s')) END)) AS vitals_date, ROUND(100.0*COUNT(DISTINCT CASE WHEN ((last_vitals_timestamp REGEXP '^[0-9]{13}$') OR (last_vitals_timestamp REGEXP '^[0-9]{10}$') OR (INSTR(last_vitals_timestamp,'T')>0) OR (STR_TO_DATE(last_vitals_timestamp,'%Y-%m-%d %H:%i:%s') IS NOT NULL)) THEN patient_id END)/NULLIF(COUNT(DISTINCT patient_id),0),2) AS pct_with_any_vitals FROM t_68d13cb9a01e732ba3149aa3_t GROUP BY vitals_date ORDER BY vitals_date;";

export function VitalsComplianceCard({ title = 'Vitals Compliance', target = 95 }: Props) {
  const defs: KPIQueryDef[] = useMemo(
    () => [
      { KPI: 'VitalsPct', query: PCT_SQL },
      { KPI: 'VitalsTrend', query: TREND_SQL },
    ],
    []
  );

  const [pctQ, trendQ] = useKPIQueries<any>(defs, true, 'Vitals');

  const loading = pctQ?.isLoading || trendQ?.isLoading;
  const error = pctQ?.isError || trendQ?.isError;

  const pctValue: number | null = useMemo(() => {
    const rows = (pctQ?.data as any)?.data ?? pctQ?.data;
    const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    return row && (row.pct_with_any_vitals ?? row.PCT_WITH_ANY_VITALS) != null
      ? Number(row.pct_with_any_vitals ?? row.PCT_WITH_ANY_VITALS)
      : null;
  }, [pctQ?.data]);

  const chartData = useMemo(() => {
    const rows = (trendQ?.data as any)?.data ?? trendQ?.data;
    if (!Array.isArray(rows)) return [];
    return rows.map((r: any) => ({
      date: r.vitals_date ?? r.VITALS_DATE,
      value: Number(r.pct_with_any_vitals ?? r.PCT_WITH_ANY_VITALS ?? 0),
      target,
    }));
  }, [trendQ?.data, target]);

  const isMetTarget = pctValue != null ? pctValue >= target : false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {pctValue != null && (
            <Badge variant={isMetTarget ? 'success' : 'warning'}>
              {isMetTarget ? 'On Track' : 'At Risk'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading…</div>}
        {error && <div>Error loading vitals compliance</div>}
        {!loading && !error && (
          <>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {pctValue != null ? `${pctValue}%` : '--'}
              </div>
              <div className="text-sm text-gray-600">Target: {target}%</div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id={`gradient-vitals`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                  <Legend />
                  <ReferenceLine y={target} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Target', position: 'right', fill: '#f59e0b', fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} fill={`url(#gradient-vitals)`} name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
