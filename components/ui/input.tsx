import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" className={cn("h-13 w-full rounded-2xl border border-[rgba(96,108,56,.22)] bg-[rgba(255,255,255,.34)] px-4 text-sm outline-none transition focus:border-[#8b9d83] focus:ring-3 focus:ring-[rgba(139,157,131,.16)] aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-200", className)} {...props} />;
}
