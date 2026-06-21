"use client";

import { Check, Gift } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

export function SuccessDialog({ open, onOpenChange, title, description, reward }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; reward?: string }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="success-dialog"><div className="success-orbit" aria-hidden="true"><i /><i /><span><Check /></span></div><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>{reward && <div className="reward-chip"><Gift /><span>{reward}</span></div>}<Button onClick={() => onOpenChange(false)}>Tiếp tục</Button></DialogContent></Dialog>;
}
