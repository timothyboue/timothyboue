import { readFile } from "node:fs/promises";

const QUERY = `*[_id == "archive"][0].images[].asset->url`;
const ENDPOINT = `https://802nsygw.apicdn.sanity.io/v2025-01-01/data/query/production?query=${encodeURIComponent(QUERY)}`;
const ACCEPT_HEADERS = ["image/avif,image/webp,*/*", "image/webp,*/*"];
const CONCURRENCY = 12;

const { result: urls } = await (await fetch(ENDPOINT)).json();
const widths = JSON.parse(await readFile(new URL("../lib/imageWidths.json", import.meta.url), "utf8"));

const jobs = (urls ?? []).flatMap((url) =>
  widths.flatMap((width) =>
    ACCEPT_HEADERS.map((accept) => ({
      url: `${url}?w=${width}&q=75&fit=max&auto=format`,
      accept,
    })),
  ),
);

let next = 0;
const worker = async () => {
  while (next < jobs.length) {
    const { url, accept } = jobs[next++];
    await fetch(url, { headers: { accept } }).then((response) => response.arrayBuffer()).catch(() => {});
  }
};

const started = Date.now();
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Warmed ${jobs.length} image variants in ${Math.round((Date.now() - started) / 1000)}s`);
