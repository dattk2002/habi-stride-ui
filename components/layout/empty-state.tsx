import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export function EmptyState({ icon, title, description, action, onAction }: { icon: React.ReactNode; title: string; description: string; action?: string; onAction?: () => void }) { return <div className="empty-state"><span>{icon}</span><h2>{title}</h2><p>{description}</p>{action && <Button onClick={onAction}><Plus />{action}</Button>}</div>; }
