import { ArchiveLoop } from "@/components/ArchiveLoop";
import { getArchiveEntries } from "@/lib/sanity";

export default async function Home() {
  const entries = await getArchiveEntries();
  if (entries.length === 0) return null;
  return <ArchiveLoop entries={entries} />;
}
