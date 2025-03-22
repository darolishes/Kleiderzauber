import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { createThumbnail, cleanupThumbnail } from "@/lib/image/thumbnail";
import { ImageProcessingError, getErrorMessage } from "@/lib/image/errors";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

interface ImageUploadProps {
  values?: string[];
  onChange: (values: string[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
  thumbnailOptions?: {
    maxWidth: number;
    maxHeight: number;
    quality?: number;
  };
}

interface ImagePreview {
  originalUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  status: "success" | "error" | "processing";
  error?: string;
  file?: File;
}

export function ImageUpload({
  values = [],
  onChange,
  onRemove,
  maxImages = 5,
  className,
  disabled = false,
  thumbnailOptions = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
  },
}: ImageUploadProps) {
  const [previews, setPreviews] = React.useState<ImagePreview[]>(
    values.map((url) => ({
      originalUrl: url,
      thumbnailUrl: url,
      width: 0,
      height: 0,
      size: 0,
      status: "success",
    }))
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<number>(0);

  const processImage = async (file: File): Promise<ImagePreview> => {
    try {
      const thumbnail = await createThumbnail(file, {
        ...thumbnailOptions,
        onRetry: (error, attempt) => {
          console.log(`Retrying thumbnail generation (attempt ${attempt})...`);
        },
      });

      return {
        originalUrl: URL.createObjectURL(file),
        thumbnailUrl: thumbnail.thumbnailUrl,
        width: thumbnail.width,
        height: thumbnail.height,
        size: thumbnail.size,
        status: "success",
      };
    } catch (error) {
      const message =
        error instanceof ImageProcessingError
          ? getErrorMessage(error.code)
          : "Failed to process image";

      return {
        originalUrl: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        width: 0,
        height: 0,
        size: file.size,
        status: "error",
        error: message,
        file,
      };
    }
  };

  const retryImage = async (index: number) => {
    const preview = previews[index];
    if (!preview.file || preview.status !== "error") return;

    const newPreviews = [...previews];
    newPreviews[index] = {
      ...preview,
      status: "processing",
    };
    setPreviews(newPreviews);

    const processedPreview = await processImage(preview.file);
    newPreviews[index] = processedPreview;
    setPreviews(newPreviews);
    onChange(
      newPreviews
        .filter((p) => p.status === "success")
        .map((p) => p.originalUrl)
    );
  };

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsLoading(true);
        setProgress(0);

        const remainingSlots = maxImages - previews.length;
        const filesToProcess = acceptedFiles.slice(0, remainingSlots);
        const totalFiles = filesToProcess.length;

        const newPreviews: ImagePreview[] = [];

        for (let i = 0; i < filesToProcess.length; i++) {
          const file = filesToProcess[i];
          const processedPreview = await processImage(file);
          newPreviews.push(processedPreview);
          setProgress(((i + 1) / totalFiles) * 100);
        }

        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        onChange(
          updatedPreviews
            .filter((p) => p.status === "success")
            .map((p) => p.originalUrl)
        );
      } catch (error) {
        console.error("Error processing images:", error);
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    },
    [onChange, previews, maxImages, thumbnailOptions]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: maxImages - previews.length,
    disabled: disabled || previews.length >= maxImages,
  });

  const handleRemove = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const preview = previews[index];
    if (preview) {
      cleanupThumbnail(preview.thumbnailUrl);
      if (preview.originalUrl !== preview.thumbnailUrl) {
        cleanupThumbnail(preview.originalUrl);
      }
    }
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onRemove(index);
  };

  React.useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        cleanupThumbnail(preview.thumbnailUrl);
        if (preview.originalUrl !== preview.thumbnailUrl) {
          cleanupThumbnail(preview.originalUrl);
        }
      });
    };
  }, [previews]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          (disabled || previews.length >= maxImages) &&
            "cursor-not-allowed opacity-60",
          className
        )}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-gray-500">
              Processing... {progress.toFixed(0)}%
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="rounded-full bg-primary/10 p-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the images here"
                  : previews.length >= maxImages
                  ? "Maximum images reached"
                  : "Drag & drop images here"}
              </p>
              <p className="text-xs text-gray-500">
                {previews.length >= maxImages
                  ? `Maximum ${maxImages} images`
                  : `or click to select (${previews.length}/${maxImages})`}
              </p>
            </div>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <ScrollArea className="h-[220px] rounded-md border">
          <div className="flex gap-4 p-4">
            {previews.map((preview, index) => (
              <div
                key={preview.thumbnailUrl}
                className="relative aspect-square h-[180px] flex-none overflow-hidden rounded-lg border"
              >
                <img
                  src={preview.thumbnailUrl}
                  alt={`Preview ${index + 1}`}
                  className={cn(
                    "h-full w-full object-cover",
                    preview.status === "error" && "opacity-50"
                  )}
                />
                {preview.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="mt-2 text-center text-xs text-white">
                      {preview.error}
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                      onClick={() => retryImage(index)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Retry
                    </Button>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 px-2 py-1 text-xs text-white rounded">
                  {`${preview.width}x${preview.height} • ${(
                    preview.size / 1024
                  ).toFixed(1)}KB`}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
