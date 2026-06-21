"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import type { CreateHabitRequest, HabitCategory } from "@/types/contracts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinearCalendar } from "./linear-calendar";
import { SuccessDialog } from "@/components/ui/success-dialog";

export function CreateHabitDialog({ onCreated }: { onCreated: () => Promise<void> }) {
  const [open, setOpen] = useState(false); const [success, setSuccess] = useState(false); const [createdName, setCreatedName] = useState(""); const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!days.length) { setError("Hãy chọn ít nhất một ngày."); return; } setSaving(true); setError(""); const form = new FormData(event.currentTarget); const name = String(form.get("name")); const payload: CreateHabitRequest = { name, category: String(form.get("category")) as HabitCategory, icon: "leaf", scheduleDays: days }; try { await apiClient("/habits", { method: "POST", body: JSON.stringify(payload) }); setCreatedName(name); setOpen(false); setSuccess(true); setDays([1, 2, 3, 4, 5, 6, 0]); await onCreated(); } catch (err) { setError(getErrorMessage(err)); } finally { setSaving(false); } }
  return <><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus />Thêm thói quen</Button></DialogTrigger><DialogContent><DialogHeader><p className="eyebrow">Lịch thực hiện</p><DialogTitle>Một bước nhỏ, đúng ngày</DialogTitle><DialogDescription>Chọn trực tiếp những ngày bạn muốn thói quen xuất hiện trong danh sách hôm nay.</DialogDescription></DialogHeader><form className="habit-form" onSubmit={submit}><div className="habit-form-grid"><Label>Tên thói quen<Input name="name" placeholder="Ví dụ: Đọc sách 20 phút" required maxLength={100} /></Label><Label>Danh mục<select name="category" defaultValue="knowledge"><option value="knowledge">Kiến thức</option><option value="health">Sức khỏe</option><option value="code">Lập trình</option><option value="other">Khác</option></select></Label></div><div><span className="form-label">Ngày thực hiện</span><LinearCalendar value={days} onChange={setDays} /></div>{error && <div className="error-box">{error}</div>}<div className="dialog-actions"><span>{days.length === 7 ? "Mỗi ngày" : `${days.length} ngày mỗi tuần`}</span><Button disabled={saving}>{saving ? "Đang gieo mầm..." : "Lưu thói quen"}<ArrowRight /></Button></div></form></DialogContent></Dialog><SuccessDialog open={success} onOpenChange={setSuccess} title="Thói quen đã được tạo" description={`“${createdName}” đã có trong lịch của bạn. Bắt đầu nhỏ và giữ nhịp đều.`} /></>;
}
