export function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function formatShortDate(value: string | Date) {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

export function getRecentIsoDays(total: number) {
  return Array.from({ length: total }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - total + 1 + index);
    return date.toISOString().slice(0, 10);
  });
}
