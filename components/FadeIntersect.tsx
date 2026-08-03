"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";

export function FadeIntersect({ children }: { children: ReactNode }) {
  const elementRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          if (record.isIntersecting) element.classList.add("in_view");
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  });

  return (
    <div className="fade-intersect" ref={elementRef}>
      {children}
    </div>
  );
}
