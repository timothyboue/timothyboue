import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";
import { BatchImageUploadInput } from "../components/BatchImageUploadInput";

export const archive = defineType({
  name: "archive",
  title: "Archive",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      options: { layout: "grid" },
      components: { input: BatchImageUploadInput },
      of: [defineArrayMember({ type: "image" })],
    }),
  ],
  preview: {
    select: { images: "images" },
    prepare: ({ images }) => ({
      title: "Archive",
      subtitle: `${images?.length ?? 0} images`,
    }),
  },
});
