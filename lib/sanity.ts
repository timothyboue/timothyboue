import { createClient } from "@sanity/client";
import type { PortableTextBlock } from "@portabletext/react";

const client = createClient({
  projectId: "802nsygw",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

export type ArchiveEntry = {
  id: string;
  src: string;
  width: number;
  height: number;
  lqip: string | null;
};

export type Info = {
  body: PortableTextBlock[] | null;
  email: string | null;
  instagram: string | null;
};

const archiveQuery = `*[_id == "archive"][0].images[defined(asset)]{
  "id": _key,
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`;

const infoQuery = `*[_id == "info"][0]{ body, email, instagram }`;

export async function getArchiveEntries() {
  return (await client.fetch<ArchiveEntry[] | null>(archiveQuery)) ?? [];
}

export async function getInfo() {
  return (
    (await client.fetch<Info | null>(infoQuery)) ?? { body: null, email: null, instagram: null }
  );
}
