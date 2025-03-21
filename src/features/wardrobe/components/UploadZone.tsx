import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  isLoading?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  isLoading = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        transition-colors duration-200 ease-in-out
        cursor-pointer
        ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <Upload
        className={`h-12 w-12 mb-4 ${
          isDragActive ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <p className="text-center text-muted-foreground">
        {isDragActive
          ? "Drop the files here..."
          : "Drag & drop images here, or click to select"}
      </p>
      {isLoading && (
        <div className="mt-4 animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      )}
    </div>
  );
};
