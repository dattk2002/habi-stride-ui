"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";
import type { CreateHabitRequest, HabitCategory } from "@/types/contracts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePreferences } from "@/components/providers/preferences-provider";
import { V2SuccessDialog } from "./success-dialog";

export function V2CreateHabitDialog({ onCreated }: { onCreated: () => Promise<void> }) {
  const { locale, t } = usePreferences(); const [open, setOpen] = useState(false); const [success, setSuccess] = useState(false); const [createdName, setCreatedName] = useState(""); const [days, setDays] = useState<number[]>([1,2,3,4,5,6,0]); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const dayKeys = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"] as const; const values = [1,2,3,4,5,6,0];
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!days.length) return setError(t("selectDayError")); setSaving(true); setError(""); const form = new FormData(event.currentTarget); const name = String(form.get("name")); const payload: CreateHabitRequest = { name, category: String(form.get("category")) as HabitCategory, icon: "leaf", scheduleDays: days }; try { await apiClient("/habits", { method: "POST", body: JSON.stringify(payload) }); setCreatedName(name); setOpen(false); setSuccess(true); setDays(values); await onCreated(); } catch (err) { setError(getErrorMessage(err)); } finally { setSaving(false); } }
  return <><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus />{t("addHabit")}</Button></DialogTrigger><DialogContent className="v2-habit-dialog"><DialogHeader><p className="v2-eyebrow">{t("habitSchedule")}</p><DialogTitle>{t("smallStepRightDay")}</DialogTitle><DialogDescription>{t("habitDialogDescription")}</DialogDescription></DialogHeader><form onSubmit={submit}><div className="v2-form-grid"><Label>{t("habitName")}<Input name="name" placeholder={t("habitExample")} required maxLength={100} /></Label><Label>{t("category")}<select name="category" defaultValue="knowledge"><option value="knowledge">{t("knowledge")}</option><option value="health">{t("health")}</option><option value="code">{t("code")}</option><option value="other">{t("other")}</option></select></Label></div><div><span className="v2-form-label">{t("activeDays")}</span><div className="v2-day-picker">{dayKeys.map((key, index) => { const value = values[index], selected = days.includes(value); const short = locale === "vi" ? (value === 0 ? "CN" : `T${value + 1}`) : t(key).slice(0, 2); return <button type="button" key={value} onClick={() => setDays(current => current.includes(value) ? current.filter(day => day !== value) : [...current, value])} className={selected ? "active" : ""} aria-pressed={selected}><span>{short}</span><strong>{index + 1}</strong><small>{selected ? <Check /> : t("choose")}</small></button>; })}</div></div>{error && <div className="error-box">{error}</div>}<div className="v2-dialog-actions"><span>{days.length === 7 ? t("everyDay") : t("daysPerWeek", { count: days.length })}</span><Button disabled={saving}>{saving ? t("seeding") : t("saveHabit")}<ArrowRight /></Button></div></form></DialogContent></Dialog><V2SuccessDialog open={success} onOpenChange={setSuccess} title={t("habitCreated")} description={t("habitCreatedDescription", { name: createdName })} /></>;
}
