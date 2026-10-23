import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineArrayMember, defineField, defineType } from "sanity";

export const info = defineType({
  name: "info",
  title: "Info",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "body",
      title: "Text",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Info" }),
  },
});
