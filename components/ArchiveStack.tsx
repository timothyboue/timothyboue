import type { Ref } from "react";
import { ArchiveItem } from "./ArchiveItem";
import type { ArchiveEntry } from "@/lib/sanity";

type ArchiveStackProps = {
  entries: ArchiveEntry[];
  onOpen: (index: number) => void;
  duplicate?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export function ArchiveStack({ entries, onOpen, duplicate, ref }: ArchiveStackProps) {
  return (
    <div className="stack" ref={ref} aria-hidden={duplicate}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-10 md:gap-6 md:gap-y-30 px-4 py-20 min-h-screen">
        {entries.map((entry, index) => (
          <ArchiveItem
            key={entry.id}
            entry={entry}
            focusable={!duplicate}
            onOpen={() => onOpen(index)}
          />
        ))}
      </div>
    </div>
  );
}
