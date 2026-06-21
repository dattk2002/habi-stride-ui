import * as React from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: React.ComponentProps<"span">) { return <span data-slot="badge" className={cn("inline-flex items-center rounded-xl bg-[rgba(139,157,131,.2)] px-2.5 py-1 text-xs font-bold text-[#526032]", className)} {...props} />; }
