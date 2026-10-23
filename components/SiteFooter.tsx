import { getInfo } from "@/lib/sanity";

export async function SiteFooter() {
  const { instagram } = await getInfo();

  return (
    <footer className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white whitespace-nowrap px-4 p-2 text-11 font-bold">
      <div>©{new Date().getFullYear()} TIMOTHY BOUE</div>
      <div>All images are the property of the artist.</div>
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      )}
    </footer>
  );
}
