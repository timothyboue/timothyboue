"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import type { ArchiveEntry } from "@/lib/sanity";

const SWIPE_THRESHOLD = 40;
const IMAGE_SIZES = "(max-width: 768px) 100vw, 80vw";
const PRELOAD_OFFSETS = [1, 2, -1];

function formatPosition(value: number) {
  return String(value).padStart(2, "0");
}

export function Carousel({ entries }: { entries: ArchiveEntry[] }) {
  const [index, setIndex] = useState(0);
  const pointerStartRef = useRef<number | null>(null);
  const total = entries.length;
  const entry = entries[index];
  const neighbours = PRELOAD_OFFSETS.map((offset) => entries[(index + offset + total) % total]);

  const step = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + total) % total);
  };

  useMountEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const sideOf = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientX < bounds.left + bounds.width / 2 ? -1 : 1;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = event.clientX;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.dataset.side = sideOf(event) < 0 ? "prev" : "next";
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start === null) return;

    const distance = event.clientX - start;
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      step(distance < 0 ? 1 : -1);
      return;
    }
    step(sideOf(event));
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Photographs"
      className="carousel flex flex-col items-center justify-center gap-4 px-4 text-16"
    >
      <div
        className="carousel_stage relative w-full"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStartRef.current = null)}
      >
        <Image
          key={entry.id}
          src={entry.src}
          alt=""
          fill
          priority={index === 0}
          loading="eager"
          sizes={IMAGE_SIZES}
          placeholder={entry.lqip ? "blur" : "empty"}
          blurDataURL={entry.lqip ?? undefined}
          draggable={false}
          className="carousel_image object-contain"
        />
      </div>

      <div className="carousel_controls flex w-full items-center justify-between">
        <button type="button" onClick={() => step(-1)}>
          Prev
        </button>
        <span aria-live="polite">
          {formatPosition(index + 1)} / {formatPosition(total)}
        </span>
        <button type="button" onClick={() => step(1)}>
          Next
        </button>
      </div>

      <div hidden>
        {neighbours.map((neighbour) => (
          <Image
            key={neighbour.id}
            src={neighbour.src}
            alt=""
            fill
            loading="eager"
            fetchPriority="low"
            sizes={IMAGE_SIZES}
          />
        ))}
      </div>
    </section>
  );
}
