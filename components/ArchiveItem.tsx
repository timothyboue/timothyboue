import Image from "next/image";
import type { ArchiveEntry } from "@/lib/sanity";

type ArchiveItemProps = {
  entry: ArchiveEntry;
  focusable: boolean;
  onOpen: () => void;
};

export function ArchiveItem({ entry, focusable, onOpen }: ArchiveItemProps) {
  return (
    <button
      type="button"
      className="item block w-full cursor-zoom-in"
      aria-label="Open image"
      tabIndex={focusable ? 0 : -1}
      onClick={onOpen}
    >
      <Image
        src={entry.src}
        alt=""
        width={entry.width}
        height={entry.height}
        sizes="(max-width: 768px) 50vw, 33vw"
        draggable={false}
        className="block w-full h-auto"
      />
    </button>
  );
}
