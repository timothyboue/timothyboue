"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { useRef } from "react";
import type { MouseEvent } from "react";
import { ArchiveStack } from "./ArchiveStack";
import { useMountEffect } from "@/hooks/useMountEffect";
import type { ArchiveEntry } from "@/lib/archive";

gsap.registerPlugin(useGSAP);

const IDLE_DELAY = 300;
const FADE_DURATION = 0.3;

function fadeToItem(root: HTMLElement | null, active: Element | null) {
  gsap.utils.toArray<HTMLElement>(".item", root).forEach((item) => {
    gsap.to(item, {
      opacity: active === null || item === active ? 1 : 0,
      duration: FADE_DURATION,
      ease: "power1.out",
    });
  });
}

export function ArchiveLoop({ entries }: { entries: ArchiveEntry[] }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const { contextSafe } = useGSAP({ scope: wrapRef });
  const focusItem = contextSafe(fadeToItem);

  const onPointerOverMedia = (event: MouseEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    document.body.classList.add("project_hover");
    focusItem(wrapRef.current, event.currentTarget.closest(".item"));
  };

  const onPointerLeaveMedia = () => {
    document.body.classList.remove("project_hover");
    focusItem(wrapRef.current, null);
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
    let lastInputAt = 0;

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

      isScrollingRef.current = true;
      lastInputAt = performance.now();
      onPointerLeaveMedia();
      virtualPosition += delta;
      render();
    });

    let frameId = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      if (performance.now() - lastInputAt > IDLE_DELAY) {
        isScrollingRef.current = false;
      }
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
      document.body.classList.remove("project_hover");
    };
  });

  return (
    <>
      <div className="arch_spacer h-[6000lvh]" ref={spacerRef} />
      <div className="fixed inset-0 overflow-hidden arch_wrap" ref={wrapRef}>
        <div className="loopTrack" ref={trackRef}>
          <ArchiveStack
            entries={entries}
            onPointerOverMedia={onPointerOverMedia}
            onPointerLeaveMedia={onPointerLeaveMedia}
            ref={stackRef}
          />
          <ArchiveStack
            entries={entries}
            onPointerOverMedia={onPointerOverMedia}
            onPointerLeaveMedia={onPointerLeaveMedia}
          />
        </div>
      </div>
    </>
  );
}
