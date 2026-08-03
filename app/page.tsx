import { ArchiveLoop } from "@/components/ArchiveLoop";
import { archiveEntries } from "@/lib/archive";

export default function Home() {
  return <ArchiveLoop entries={archiveEntries} />;
}
