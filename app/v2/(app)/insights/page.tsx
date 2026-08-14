"use client";
import { ArrowDownRight, ArrowUpRight, Download, Flame, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { V2PageHeader } from "@/components/v2/page-header";
import { V2LoadingState as LoadingState } from "@/components/v2/loading-state";
import { Button } from "@/components/ui/button";
import { apiClient, downloadAnalytics } from "@/lib/api-client";
import { getRecentIsoDays } from "@/lib/date";
import { getErrorMessage } from "@/lib/utils";
import type { AnalyticsOverview, HeatmapPoint } from "@/types/contracts";
import { usePreferences } from "@/components/providers/preferences-provider";

export default function InsightsV2Page() {
  const { t } = usePreferences(); const [overview,setOverview]=useState<AnalyticsOverview|null>(null); const [heatmap,setHeatmap]=useState<HeatmapPoint[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const days=useMemo(()=>getRecentIsoDays(84),[]); const counts=useMemo(()=>new Map(heatmap.map(item=>[item.date,item.count])),[heatmap]);
  useEffect(()=>{const timer=setTimeout(()=>Promise.all([apiClient<AnalyticsOverview>("/analytics/overview"),apiClient<HeatmapPoint[]>(`/analytics/heatmap?year=${new Date().getFullYear()}`)]).then(([a,h])=>{setOverview(a);setHeatmap(h);}).catch(err=>setError(getErrorMessage(err))).finally(()=>setLoading(false)),0);return()=>clearTimeout(timer);},[]);
  async function download(format:"csv"|"pdf"){try{await downloadAnalytics(format);}catch(err){setError(getErrorMessage(err));}}
  if(loading)return <LoadingState/>; const total=overview?.total_tasks_completed||0; const best=overview?.best_streak||0; const consistent=overview?.most_consistent_habit?.count||0;
  return <div className="v2-view"><V2PageHeader eyebrow={t("insightsEyebrow")} title={t("insightsTitle")} description={t("insightsDescription")} action={<div className="v2-export"><Button variant="outline" onClick={()=>download("csv")}><Download/>CSV</Button><Button variant="outline" onClick={()=>download("pdf")}><Download/>PDF</Button></div>}/>{error&&<div className="error-box">{error}</div>}<section className="v2-metrics" data-reveal><Metric icon={<Target/>} label={t("tasksCompleted")} value={total} unit={t("times")} tone="moss"/><Metric icon={<Flame/>} label={t("bestStreak")} value={best} unit={t("days")} tone="terra"/><Metric icon={consistent?<ArrowUpRight/>:<ArrowDownRight/>} label={t("mostConsistent")} value={consistent} unit={overview?.most_consistent_habit?.name||t("noData")} tone="oat"/></section><section className="v2-heatmap-card" data-reveal data-scroll-media><div className="v2-section-heading"><div><p>{t("activityMap")}</p><h2>{t("rhythm12Weeks")}</h2></div><span>{t("eachCellDay")}</span></div><div className="v2-heatmap">{days.map(day=>{const count=counts.get(day)||0;return <span key={day} title={`${day}: ${count}`} className={`heat-${Math.min(count,3)}`}/>;})}</div><div className="v2-heat-legend"><span>{t("less")}</span>{[0,1,2,3].map(value=><i key={value} className={`heat-${value}`}/>)}<span>{t("more")}</span></div></section></div>;
}
function Metric({icon,label,value,unit,tone}:{icon:React.ReactNode;label:string;value:number;unit:string;tone:string}){return <article className={`v2-metric ${tone}`} data-stack-card><span>{icon}</span><p>{label}</p><strong>{value}</strong><small>{unit}</small></article>;}
