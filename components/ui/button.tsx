import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[rgba(198,107,61,.3)]", { variants: { variant: { default: "bg-[#606c38] text-white [&_*]:text-white hover:bg-[#53602f] hover:-translate-y-0.5", outline: "border border-[rgba(96,108,56,.3)] bg-transparent hover:bg-[rgba(139,157,131,.14)]", ghost: "bg-transparent hover:bg-[rgba(139,157,131,.14)]", destructive: "bg-[#c66b3d] text-[#e8dcc7]" }, size: { default: "h-10", sm: "h-9 min-h-9 rounded-xl px-3", lg: "h-12 min-h-12 px-7", icon: "size-10 min-h-10 p-0" } }, defaultVariants: { variant: "default", size: "default" } });

export function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
