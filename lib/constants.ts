import type { HabitCategory } from "@/types/contracts";

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  code: "Lập trình",
  health: "Sức khỏe",
  knowledge: "Kiến thức",
  other: "Khác",
};

export const WEEK_DAYS = [
  { value: 1, short: "T2", label: "Thứ hai" },
  { value: 2, short: "T3", label: "Thứ ba" },
  { value: 3, short: "T4", label: "Thứ tư" },
  { value: 4, short: "T5", label: "Thứ năm" },
  { value: 5, short: "T6", label: "Thứ sáu" },
  { value: 6, short: "T7", label: "Thứ bảy" },
  { value: 0, short: "CN", label: "Chủ nhật" },
] as const;
