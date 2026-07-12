"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ChapterUpload() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/zip": [".zip", ".cbz"]
    }
  });

  return (
    <div
      {...getRootProps()}
      className="rounded-xl border-2 border-dashed border-gray-600 p-10 text-center cursor-pointer transition hover:border-yellow-400"
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p className="text-yellow-400 text-lg">
          Faylni shu yerga tashlang...
        </p>
      ) : (
        <>
          <p className="text-2xl">📄</p>

          <p className="mt-3 text-lg font-semibold">
            PDF yoki CBZ faylni tashlang
          </p>

          <p className="mt-2 text-sm text-gray-400">
            yoki bosib tanlang
          </p>
        </>
      )}
    </div>
  );
}