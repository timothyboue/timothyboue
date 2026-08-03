import Link from "next/link";

const WORDMARK = "TIMOTHY BOUE";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full mix-blend-difference text-white z-50">
      <div className="header_content relative items-center justify-between flex m-4 z-10">
        <div className="left">
          <Link href="/" className="wordmark text-16">
            {WORDMARK}
          </Link>
        </div>
        <div className="right min-w-1/3 px-1 m-text-16">
          <Link href="/">Index</Link>
          <span>,</span> <Link href="/info">Info</Link>
        </div>
      </div>
    </header>
  );
}
