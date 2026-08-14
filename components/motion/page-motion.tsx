"use client";

import { useGSAP } from "@/lib/vendor/use-gsap";
import { gsap } from "@/lib/vendor/gsap";
import { ScrollTrigger } from "@/lib/vendor/scroll-trigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);
export function PageMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null); const pathname = usePathname();
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo("[data-reveal]", { opacity: 0, y: 34, scale: .985 }, { opacity: 1, y: 0, scale: 1, duration: .88, stagger: .085, ease: "power3.out", clearProps: "transform" });
    gsap.utils.toArray<HTMLElement>("[data-scroll-media]").forEach(element => gsap.fromTo(element, { scale: .82, opacity: .42 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: element, start: "top 94%", end: "center 48%", scrub: 1.1 } }));
    gsap.utils.toArray<HTMLElement>("[data-stack-card]").forEach((card, index) => gsap.fromTo(card, { y: 52 + index * 10, opacity: 0 }, { y: 0, opacity: 1, scrollTrigger: { trigger: card, start: "top 94%", end: "top 65%", scrub: .75 }, onComplete: () => card.style.removeProperty("transform") }));
  }, { scope, dependencies: [pathname], revertOnUpdate: true });
  return <div ref={scope} className="route-stage" key={pathname}>{children}</div>;
}
