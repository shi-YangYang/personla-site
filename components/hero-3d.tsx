"use client";

import { Code3D } from "./code-3d";

export function Hero3D() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div className="absolute inset-x-[-20%] bottom-0 h-[52%] perspective-grid opacity-70" />

      <Code3D
        className="left-[3%] top-[14%] opacity-40 text-4xl md:text-6xl hidden md:block"
        code="while (alive) { code(); }"
      />
      <Code3D
        className="right-[3%] bottom-[16%] opacity-30 text-2xl md:text-4xl hidden md:block"
        code='const ship = () => "v1.0";'
      />
    </div>
  );
}
