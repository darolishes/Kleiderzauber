import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/ui/use-toast";

interface UploadZoneProps {
  onUpload: (files: File[]) => Promise<string[]>;
  className?: string;
}

export function UploadZone({ onUpload, className }: UploadZoneProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      try {
        setIsUploading(true);
        setProgress(0);

        // Validate files
        const validFiles = acceptedFiles.filter((file) => {
          if (!file.type.startsWith("image/")) {
            toast({
              title: "Invalid file type",
              description: `${file.name} is not an image file`,
              variant: "destructive",
            });
            return false;
          }
          if (file.size > 10 * 1024 * 1024) {
            // 10MB
            toast({
              title: "File too large",
              description: `${file.name} is larger than 10MB`,
              variant: "destructive",
            });
            return false;
          }
          return true;
        });

        if (validFiles.length === 0) {
          return;
        }

        // Simulate progress (replace with actual upload progress)
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);

        await onUpload(validFiles);
        setProgress(100);

        toast({
          title: "Upload successful",
          description: `Successfully uploaded ${validFiles.length} file${
            validFiles.length === 1 ? "" : "s"
          }`,
        });

        // Clear progress after a delay
        setTimeout(() => {
          setProgress(0);
          clearInterval(progressInterval);
        }, 1000);
      } catch (error) {
        toast({
          title: "Upload failed",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while uploading",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    disabled: isUploading,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 px-6 py-10 transition-colors hover:bg-gray-50",
        isDragActive && "border-primary bg-primary/5",
        isUploading && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          {isUploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploading...</p>
              <div className="w-full max-w-xs">
                <Progress value={progress} className="h-1" />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the files here"
                  : "Drag & drop files here"}
              </p>
              <p className="text-xs text-gray-500">or click to select files</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
