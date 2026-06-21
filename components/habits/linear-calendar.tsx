"use client";
import { Check } from "lucide-react";
import { WEEK_DAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LinearCalendar({ value, onChange }: { value: number[]; onChange: (days: number[]) => void }) {
  function toggle(day: number) { onChange(value.includes(day) ? value.filter(item => item !== day) : [...value, day]); }
  return <div className="linear-calendar" role="group" aria-label="Chọn ngày thực hiện"><div className="calendar-line" />{WEEK_DAYS.map((day, index) => { const selected = value.includes(day.value); return <button type="button" key={day.value} className={cn("calendar-day", selected && "selected")} onClick={() => toggle(day.value)} aria-pressed={selected}><span>{day.short}</span><strong>{index + 1}</strong><small>{selected ? <Check size={14} /> : "Chọn"}</small></button>; })}</div>;
}
