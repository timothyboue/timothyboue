import { Carousel } from "@/components/Carousel";
import { getArchiveEntries } from "@/lib/sanity";

export default async function Home() {
  const entries = await getArchiveEntries();
  if (entries.length === 0) return null;
  return <Carousel entries={entries} />;
}
