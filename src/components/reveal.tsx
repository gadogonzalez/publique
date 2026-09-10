"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Fades and slides content in once, the first time it enters the
 * viewport. Skips the animation entirely (renders visible immediately)
 * when the user has prefers-reduced-motion set, or when JS hasn't run yet
 * (no-JS/first paint) -- opacity-0 is only applied after mount, never in
 * the server-rendered markup, so content is never invisible without a
 * script to reveal it.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    queueMicrotask(() => {
      setReady(true);
      if (reduced) setVisible(true);
    });

    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out motion-reduce:transition-none",
        ready && !visible ? "translate-y-5 scale-[0.98] opacity-0" : "translate-y-0 scale-100 opacity-100",
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
