"use client";

import Lenis from "lenis";
import { useRef, useState } from "react";
import { ArchiveStack } from "./ArchiveStack";
import { Lightbox } from "./Lightbox";
import { useMountEffect } from "@/hooks/useMountEffect";
import type { ArchiveEntry } from "@/lib/sanity";

export function ArchiveLoop({ entries }: { entries: ArchiveEntry[] }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    lenisRef.current?.stop();
    setOpenIndex(index);
  };

  const closeImage = () => {
    lenisRef.current?.start();
    setOpenIndex(null);
  };

  const stepImage = (direction: 1 | -1) => {
    setOpenIndex((current) =>
      current === null ? current : (current + direction + entries.length) % entries.length,
    );
  };

  useMountEffect(() => {
    const track = trackRef.current;
    const stack = stackRef.current;
    const spacer = spacerRef.current;
    if (!track || !stack || !spacer) return;

    let stackHeight = 0;
    let maxScroll = 0;
    let virtualPosition = 0;
    let lastScroll = 0;

    const render = () => {
      if (!stackHeight) return;
      const offset = -(((virtualPosition % stackHeight) + stackHeight) % stackHeight);
      if (!Number.isFinite(offset)) return;
      track.style.transform = `translate3d(0, ${Math.round(offset)}px, 0)`;
    };

    const measure = () => {
      stackHeight = stack.getBoundingClientRect().height;
      const spacerHeight = spacer.getBoundingClientRect().height;
      maxScroll = Math.max(0, spacerHeight - window.innerHeight);
    };

    const lenis = new Lenis({ infinite: true, syncTouch: true });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      const scroll = lenis.scroll;
      if (!Number.isFinite(scroll)) return;

      let delta = scroll - lastScroll;
      lastScroll = scroll;

      if (maxScroll > 0) {
        const wrapThreshold = maxScroll * 0.5;
        if (delta > wrapThreshold) delta -= maxScroll;
        else if (delta < -wrapThreshold) delta += maxScroll;
      }
      if (Math.abs(delta) <= 0.01) return;

      virtualPosition += delta;
      render();
    });

    let frameId = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);

    measure();
    lastScroll = lenis.scroll;
    render();

    const remeasure = () => {
      measure();
      render();
    };
    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(stack);
    resizeObserver.observe(spacer);
    window.addEventListener("resize", remeasure);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", remeasure);
      lenis.destroy();
      lenisRef.current = null;
    };
  });

  return (
    <>
      <div className="arch_spacer h-[6000lvh]" ref={spacerRef} />
      <div className="fixed inset-0 overflow-hidden">
        <div className="loopTrack" ref={trackRef}>
          <ArchiveStack entries={entries} onOpen={openImage} ref={stackRef} />
          <ArchiveStack entries={entries} onOpen={openImage} duplicate />
        </div>
      </div>
      {openIndex !== null && (
        <Lightbox
          entries={entries}
          index={openIndex}
          onStep={stepImage}
          onClose={closeImage}
        />
      )}
    </>
  );
}
