"use client";

import { useEffect, useState } from "react";

type Ripple = { id: number; x: number; y: number };

export function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let id = 0;
    const onClick = (e: MouseEvent) => {
      const r = { id: id++, x: e.clientX, y: e.clientY };
      setRipples((list) => [...list, r]);
      setTimeout(() => {
        setRipples((list) => list.filter((i) => i.id !== r.id));
      }, 800);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border border-brand-glow/60"
          style={{
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.8s cubic-bezier(0, 0, 0.2, 1) forwards",
          }}
        />
      ))}
    </div>
  );
}
