"use client";

import { useEffect, useState } from "react";

export function TypingText({
  texts,
  speed = 55,
  hold = 1600,
  deleteSpeed = 30,
  delay = 0,
  className,
}: {
  texts: string[];
  speed?: number;
  hold?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const full = texts[idx % texts.length];

      if (!deleting) {
        setDisplay(full.slice(0, display.length + 1));
        if (display.length + 1 >= full.length) {
          timeout = setTimeout(() => setDeleting(true), hold);
        } else {
          timeout = setTimeout(tick, speed);
        }
      } else {
        setDisplay(full.slice(0, display.length - 1));
        if (display.length - 1 <= 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % texts.length);
          timeout = setTimeout(tick, 300);
        } else {
          timeout = setTimeout(tick, deleteSpeed);
        }
      }
    };

    const start = setTimeout(tick, delay);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(start);
    };
  }, [display, deleting, idx, texts, speed, hold, deleteSpeed, delay]);

  return (
    <span className={className}>
      {display}
      <span className="animate-pulse text-brand-glow">▊</span>
    </span>
  );
}
