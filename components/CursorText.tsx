"use client";

import { useRef } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";

const OFFSET_X = 20;
const OFFSET_Y = 40;

export function CursorText() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.style.setProperty("--x", "-100px");
    cursor.style.setProperty("--y", "-100px");

    const onMouseMove = (event: MouseEvent) => {
      cursor.style.setProperty("--x", `${event.clientX + OFFSET_X}px`);
      cursor.style.setProperty("--y", `${event.clientY + OFFSET_Y}px`);
    };
    const onTouchStart = () => {
      cursor.style.display = "none";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  });

  return (
    <div id="cursor_text" aria-hidden={true} ref={cursorRef}>
      see the project
    </div>
  );
}
