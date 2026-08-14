import { cn } from "@/lib/utils";

export function TreeVisual({ stage, className }: { stage: number; className?: string }) {
  const growth = Math.max(0, Math.min(4, stage));
  return <svg className={cn("v2-tree-visual", className)} viewBox="0 0 420 440" role="img" aria-label={`Tree level ${stage}`}>
    <defs><linearGradient id="trunk" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--clay)" /><stop offset="1" stopColor="var(--terra)" /></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="18" /></filter></defs>
    <ellipse className="tree-aura" cx="210" cy="365" rx="155" ry="35" filter="url(#soft)" />
    <path className="tree-ground" d="M58 368c52-46 251-48 310 0-65 40-242 48-310 0Z" />
    <path className="tree-trunk" d="M198 371c9-74 5-127 9-192l18-5c-2 73 2 133 17 197-17 13-28 13-44 0Z" />
    {growth >= 1 && <><path className="tree-branch" d="M214 276c-42-21-62-47-76-74M218 247c39-18 62-45 75-75" /><Leaf x={102} y={137} rotate={-34} /><Leaf x={273} y={112} rotate={32} /></>}
    {growth >= 2 && <><path className="tree-branch" d="M215 221c-32-27-49-55-54-86M219 199c29-20 46-48 53-79" /><Leaf x={130} y={76} rotate={-22} /><Leaf x={252} y={56} rotate={25} /><Leaf x={71} y={191} rotate={-54} /></>}
    {growth >= 3 && <><path className="tree-branch" d="M216 174c-9-34-7-63 3-92" /><Leaf x={184} y={25} rotate={4} /><Leaf x={310} y={170} rotate={50} /><Leaf x={84} y={95} rotate={-45} /></>}
    {growth >= 4 && <><Leaf x={294} y={57} rotate={48} accent /><Leaf x={47} y={135} rotate={-64} accent /><Leaf x={228} y={7} rotate={18} accent /><circle className="tree-fruit" cx="145" cy="168" r="10" /><circle className="tree-fruit" cx="285" cy="157" r="9" /></>}
  </svg>;
}
function Leaf({ x, y, rotate, accent = false }: { x: number; y: number; rotate: number; accent?: boolean }) { return <g transform={`translate(${x} ${y}) rotate(${rotate})`}><path className={accent ? "tree-leaf accent" : "tree-leaf"} d="M0 39C4 8 29-8 61 4 57 34 33 54 0 39Z" /><path className="tree-vein" d="M5 37 50 8" /></g>; }
