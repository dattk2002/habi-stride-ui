"use client";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LoadingState } from "@/components/layout/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient, downloadAnalytics } from "@/lib/api-client";
import { getRecentIsoDays } from "@/lib/date";
import { getErrorMessage } from "@/lib/utils";
import type { AnalyticsOverview, HeatmapPoint } from "@/types/contracts";

export default function InsightsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null); const [heatmap, setHeatmap] = useState<HeatmapPoint[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const days = useMemo(() => getRecentIsoDays(84), []); const counts = useMemo(() => new Map(heatmap.map(item => [item.date, item.count])), [heatmap]);
  useEffect(() => { const timer = window.setTimeout(() => Promise.all([apiClient<AnalyticsOverview>("/analytics/overview"), apiClient<HeatmapPoint[]>(`/analytics/heatmap?year=${new Date().getFullYear()}`)]).then(([a, h]) => { setOverview(a); setHeatmap(h); }).catch(err => setError(getErrorMessage(err))).finally(() => setLoading(false)), 0); return () => clearTimeout(timer); }, []);
  async function download(format: "csv" | "pdf") { try { await downloadAnalytics(format); } catch (err) { setError(getErrorMessage(err)); } }
  if (loading) return <LoadingState />;
  return <div className="view-stack">{error && <div className="error-box">{error}</div>}<PageHeader eyebrow="Nhìn lại hành trình" title="Phân tích tiến độ" description="Dữ liệu 30 ngày gần nhất và nhịp duy trì trong năm." action={<div className="export-actions"><Button variant="outline" onClick={() => download("csv")}><Download />CSV</Button><Button variant="outline" onClick={() => download("pdf")}><Download />PDF</Button></div>} /><div className="metric-grid"><Metric label="Đã hoàn thành" value={overview?.total_tasks_completed || 0} unit="lần" /><Metric label="Chuỗi tốt nhất" value={overview?.best_streak || 0} unit="ngày" /><Metric label="Ổn định nhất" value={overview?.most_consistent_habit?.count || 0} unit={overview?.most_consistent_habit?.name || "chưa có dữ liệu"} /></div><Card><CardContent><SectionHeader label="NHỊP ĐỘ 12 TUẦN" title="Mỗi ô là một ngày" /><div className="heatmap">{days.map(day => { const count = counts.get(day) || 0; return <span key={day} title={`${day}: ${count} lần`} className={`heat-${Math.min(count, 3)}`} />; })}</div><div className="heat-legend"><span>Ít</span>{[0, 1, 2, 3].map(value => <i key={value} className={`heat-${value}`} />)}<span>Nhiều</span></div></CardContent></Card></div>;
}
function Metric({ label, value, unit }: { label: string; value: number; unit: string }) { return <Card><CardContent className="metric"><span>{label}</span><strong>{value}</strong><small>{unit}</small></CardContent></Card>; }
