"use client";

import type { MouseEventHandler, Ref } from "react";
import { ArchiveItem } from "./ArchiveItem";
import type { ArchiveEntry } from "@/lib/archive";

type ArchiveStackProps = {
  entries: ArchiveEntry[];
  onPointerOverMedia: MouseEventHandler<HTMLDivElement>;
  onPointerLeaveMedia: MouseEventHandler<HTMLDivElement>;
  ref?: Ref<HTMLDivElement>;
};

export function ArchiveStack({
  entries,
  onPointerOverMedia,
  onPointerLeaveMedia,
  ref,
}: ArchiveStackProps) {
  return (
    <div className="stack" ref={ref}>
      <div className="grids">
        <div className="grid grid_item py-20 grid-cols-2 md:grid-cols-3 p-4 gap-20 md:gap-6 md:gap-y-30 min-h-screen">
          {entries.map((entry) => (
            <ArchiveItem
              key={entry.id}
              entry={entry}
              onPointerOverMedia={onPointerOverMedia}
              onPointerLeaveMedia={onPointerLeaveMedia}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
