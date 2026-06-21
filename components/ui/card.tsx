import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card" className={cn("rounded-[24px] border border-[rgba(96,108,56,.14)] bg-[rgba(212,184,149,.24)] shadow-[0_12px_32px_rgba(74,68,48,.07)] backdrop-blur-xl", className)} {...props} />; }
export function CardHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card-header" className={cn("p-6 pb-0", className)} {...props} />; }
export function CardContent({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="card-content" className={cn("p-6", className)} {...props} />; }
export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) { return <h3 data-slot="card-title" className={cn("text-xl font-bold", className)} {...props} />; }
export function CardDescription({ className, ...props }: React.ComponentProps<"p">) { return <p data-slot="card-description" className={cn("text-sm text-[#6d705f]", className)} {...props} />; }
