"use client";

import Image from "next/image";
import { useRef } from "react";
import type { PointerEvent } from "react";
import { useMountEffect } from "@/hooks/useMountEffect";
import type { ArchiveEntry } from "@/lib/sanity";

const SWIPE_THRESHOLD = 40;

type LightboxProps = {
  entries: ArchiveEntry[];
  index: number;
  onStep: (direction: 1 | -1) => void;
  onClose: () => void;
};

function formatPosition(value: number) {
  return String(value).padStart(2, "0");
}

export function Lightbox({ entries, index, onStep, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointerStartRef = useRef<number | null>(null);
  const entry = entries[index];
  const neighbours = [
    entries[(index + 1) % entries.length],
    entries[(index - 1 + entries.length) % entries.length],
  ];

  useMountEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = event.clientX;
  };

  const sideOf = (clientX: number) => (clientX < window.innerWidth / 2 ? -1 : 1);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.dataset.side = sideOf(event.clientX) < 0 ? "prev" : "next";
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start === null || (event.target as HTMLElement).closest("button")) return;

    const distance = event.clientX - start;
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      onStep(distance < 0 ? 1 : -1);
      return;
    }
    onStep(sideOf(event.clientX));
  };

  return (
    <div
      role="dialog"
      aria-modal={true}
      aria-label="Image viewer"
      data-lenis-prevent
      className="lightbox fixed inset-0 z-[60] bg-white text-16 select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (pointerStartRef.current = null)}
    >
      <div className="absolute inset-x-0 top-0 flex justify-between lightbox_bar lightbox_top z-10">
        <span>
          {formatPosition(index + 1)} / {formatPosition(entries.length)}
        </span>
        <button type="button" ref={closeRef} onClick={onClose}>
          Close
        </button>
      </div>

      <div className="lightbox_stage absolute flex items-center justify-center">
        <Image
          key={entry.id}
          src={entry.src}
          alt=""
          width={entry.width}
          height={entry.height}
          sizes="100vw"
          draggable={false}
          className="lightbox_image block max-w-full max-h-full w-auto h-auto object-contain"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-between lightbox_bar lightbox_bottom z-10">
        <button type="button" onClick={() => onStep(-1)}>
          Prev
        </button>
        <button type="button" onClick={() => onStep(1)}>
          Next
        </button>
      </div>

      <div hidden>
        {neighbours.map((neighbour) => (
          <Image
            key={neighbour.id}
            src={neighbour.src}
            alt=""
            width={neighbour.width}
            height={neighbour.height}
            sizes="100vw"
          />
        ))}
      </div>
    </div>
  );
}
