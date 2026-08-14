"use client";
import { Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePreferences } from "@/components/providers/preferences-provider";
export function V2SuccessDialog({ open, onOpenChange, title, description, reward }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; reward?: string }) { const { t } = usePreferences(); return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="v2-success"><div className="v2-success-orbit"><i /><i /><span><Check /></span></div><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>{reward && <div className="v2-reward"><Gift />{reward}</div>}<Button onClick={() => onOpenChange(false)}>{t("continue")}</Button></DialogContent></Dialog>; }
