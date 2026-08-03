"use client";

import Image from "next/image";
import type { MouseEventHandler } from "react";
import type { ArchiveEntry } from "@/lib/archive";

type ArchiveItemProps = {
  entry: ArchiveEntry;
  onPointerOverMedia: MouseEventHandler<HTMLDivElement>;
  onPointerLeaveMedia: MouseEventHandler<HTMLDivElement>;
};

export function ArchiveItem({
  entry,
  onPointerOverMedia,
  onPointerLeaveMedia,
}: ArchiveItemProps) {
  return (
    <div className="item">
      <div className="w-full relative z-10 desc pointer-events-none text-16 pb-2">
        {entry.title}
      </div>
      <div
        className="img"
        onMouseEnter={onPointerOverMedia}
        onMouseMove={onPointerOverMedia}
        onMouseLeave={onPointerLeaveMedia}
      >
        <div aria-hidden={true}>
          <Image
            src={entry.src}
            alt={entry.title}
            width={entry.width}
            height={entry.height}
            sizes="(max-width: 768px) 40vw, 32vw"
            className="block w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
