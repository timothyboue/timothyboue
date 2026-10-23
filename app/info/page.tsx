import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { getInfo } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Info — TIMOTHY BOUE",
};

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default async function Info() {
  const { body, email } = await getInfo();

  return (
    <main className="info px-4 pt-32 pb-20 text-16">
      <div className="md:w-1/3 md:ml-auto md:px-1 max-w-[40rem] flex flex-col gap-6">
        {body && <PortableText value={body} components={components} />}
        {email && (
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
      </div>
    </main>
  );
}
