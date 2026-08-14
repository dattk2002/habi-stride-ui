export type GsapContext = { add: (callback: () => void, scope?: React.RefObject<HTMLElement | null>) => void; revert: () => void };
export type GsapCore = {
  registerPlugin: (...plugins: unknown[]) => void;
  context: (callback: () => void, scope?: React.RefObject<HTMLElement | null>) => GsapContext;
  fromTo: (target: unknown, from: Record<string, unknown>, to: Record<string, unknown>) => unknown;
  utils: { toArray: <T extends Element>(selector: string) => T[] };
};
export const gsap: GsapCore;
export default gsap;
