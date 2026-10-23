import type { StructureResolver } from "sanity/structure";

const singletons = [
  { type: "archive", title: "Archive" },
  { type: "info", title: "Info" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items(
      singletons.map(({ type, title }) =>
        S.listItem()
          .title(title)
          .schemaType(type)
          .child(S.document().schemaType(type).documentId(type).title(title)),
      ),
    );
