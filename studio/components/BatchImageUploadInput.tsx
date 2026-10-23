import { Button, Stack, Text } from "@sanity/ui";
import { UploadIcon } from "@sanity/icons/Upload";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { insert, setIfMissing, useClient } from "sanity";
import type { ArrayOfObjectsInputProps } from "sanity";

const BATCH_SIZE = 5;

function createKey() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 12);
}

export function BatchImageUploadInput(props: ArrayOfObjectsInputProps) {
  const { onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2025-01-01" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const uploadFiles = async (files: File[]) => {
    setProgress({ done: 0, total: files.length });
    onChange(setIfMissing([]));

    for (let start = 0; start < files.length; start += BATCH_SIZE) {
      const batch = files.slice(start, start + BATCH_SIZE);
      const assets = await Promise.all(
        batch.map((file) => client.assets.upload("image", file, { filename: file.name })),
      );
      const items = assets.map((asset) => ({
        _type: "image",
        _key: createKey(),
        asset: { _type: "reference", _ref: asset._id },
      }));
      onChange(insert(items, "after", [-1]));
      setProgress({ done: start + batch.length, total: files.length });
    }

    setProgress(null);
  };

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) uploadFiles(files);
  };

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        hidden
        onChange={onFilesSelected}
      />
      <Button
        icon={UploadIcon}
        mode="ghost"
        text={progress ? `Uploading ${progress.done} / ${progress.total}…` : "Upload multiple images"}
        disabled={readOnly || progress !== null}
        onClick={() => fileInputRef.current?.click()}
      />
      <Text size={1} muted>
        Drag images to reorder them. The first image appears first on the site.
      </Text>
    </Stack>
  );
}
