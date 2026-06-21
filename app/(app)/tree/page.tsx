"use client";
import { Check, PackageOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/layout/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeader } from "@/components/layout/section-header";
import { TreeArt } from "@/components/tree/tree-art";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";
import { formatShortDate } from "@/lib/date";
import { getErrorMessage } from "@/lib/utils";
import type { UserTree } from "@/types/contracts";

const itemNames: Record<string, string> = { fertilizer: "Phân bón", magic_water: "Nước phép", decorative_pot: "Chậu trang trí" };
export default function TreePage() {
  const [tree, setTree] = useState<UserTree | null>(null); const [loading, setLoading] = useState(true); const [using, setUsing] = useState(""); const [error, setError] = useState("");
  const load = useCallback(async () => { try { setTree(await apiClient<UserTree>("/tree")); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => clearTimeout(timer); }, [load]);
  async function applyItem(item: string) { setUsing(item); try { await apiClient("/tree/use-item", { method: "POST", body: JSON.stringify({ item }) }); await load(); } catch (err) { setError(getErrorMessage(err)); } finally { setUsing(""); } }
  if (loading || !tree) return <LoadingState />; const threshold = tree.next_stage_exp || tree.exp || 1; const percent = Math.min(100, Math.round(tree.exp / threshold * 100));
  return <div className="view-stack">{error && <div className="error-box">{error}</div>}<PageHeader eyebrow="Thành quả hữu hình" title="Cây tiến bộ" description="Mỗi lần hoàn thành thói quen sẽ nuôi cây lớn hơn." /><section className="tree-hero"><div className="tree-stage"><i className="tree-halo" /><TreeArt stage={tree.stage} large /><span>Nhánh {tree.branch === "tech" ? "Công nghệ" : tree.branch === "scholar" ? "Tri thức" : "Tự nhiên"}</span></div><div className="tree-details"><span className="section-label">CẤP ĐỘ HIỆN TẠI</span><h2>Cấp {tree.stage}</h2><p>{tree.exp} / {threshold} EXP</p><Progress value={percent} /><small>{Math.max(0, threshold - tree.exp)} EXP nữa để đạt cấp tiếp theo</small></div></section><div className="two-column"><Card><CardContent><SectionHeader label="KHO ĐỒ" title="Vật phẩm" />{tree.items.length ? <div className="inventory">{tree.items.map((item, index) => <Button variant="outline" key={`${item}-${index}`} onClick={() => applyItem(item)} disabled={!!using}><PackageOpen /><span>{itemNames[item] || item}</span></Button>)}</div> : <p className="empty-copy">Vật phẩm sẽ xuất hiện khi cây lên cấp.</p>}</CardContent></Card><Card><CardContent><SectionHeader label="CỘT MỐC" title="Thành tựu" />{tree.achievements.length ? <div className="achievement-list">{tree.achievements.map(item => <div key={item.id}><span><Check /></span><div><strong>{achievementName(item.achievementKey)}</strong><small>{formatShortDate(item.unlockedAt)}</small></div></div>)}</div> : <p className="empty-copy">Duy trì chuỗi ngày để mở khóa thành tựu.</p>}</CardContent></Card></div></div>;
}
function achievementName(key: string) { return key === "first_7_day_streak" ? "Chuỗi 7 ngày đầu tiên" : key.startsWith("tree_stage_") ? `Cây đạt cấp ${key.split("_").pop()}` : key; }
