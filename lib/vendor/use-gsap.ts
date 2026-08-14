/*
 * Adapter based on @gsap/react 2.1.2.
 * Copyright 2008-2025 GreenSock. Used under the GSAP Standard License.
 */
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "./gsap";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;
type Config = { scope?: React.RefObject<HTMLElement | null>; dependencies?: unknown[]; revertOnUpdate?: boolean };

export function useGSAP(callback: () => void, config: Config = {}) {
  const { scope, dependencies = [], revertOnUpdate = false } = config;
  const mounted = useRef(false);
  const context = useRef(gsap.context(() => undefined, scope));
  const deferCleanup = dependencies.length > 0 && !revertOnUpdate;
  useIsomorphicLayoutEffect(() => { if (!deferCleanup) return; mounted.current = true; return () => context.current.revert(); }, []);
  useIsomorphicLayoutEffect(() => {
    context.current.add(callback, scope);
    if (!deferCleanup || !mounted.current) return () => context.current.revert();
  }, dependencies);
}
