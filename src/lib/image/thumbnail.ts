import { retry } from "@/lib/utils/retry";
import {
  ImageProcessingError,
  ImageErrorCode,
  isRetryableError,
} from "./errors";

interface ThumbnailOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number; // 0 to 1
  maintainAspectRatio?: boolean;
  maxRetries?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

interface ThumbnailResult {
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number; // in bytes
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const loadImage = async (imageUrl: string): Promise<HTMLImageElement> => {
  const image = new Image();
  await retry(
    () =>
      new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () =>
          reject(
            new ImageProcessingError(
              "Failed to load image",
              ImageErrorCode.LOAD_FAILED
            )
          );
        image.src = imageUrl;
      }),
    {
      maxAttempts: 3,
      shouldRetry: (error) =>
        error instanceof ImageProcessingError && isRetryableError(error),
    }
  );
  return image;
};

const createBlob = async (
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> => {
  return await retry(
    () =>
      new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(
                new ImageProcessingError(
                  "Failed to create blob",
                  ImageErrorCode.BLOB_CREATION_FAILED
                )
              );
            }
          },
          mimeType,
          quality
        );
      }),
    {
      maxAttempts: 3,
      shouldRetry: (error) =>
        error instanceof ImageProcessingError && isRetryableError(error),
    }
  );
};

export const createThumbnail = async (
  file: File,
  options: ThumbnailOptions
): Promise<ThumbnailResult> => {
  const {
    maxWidth,
    maxHeight,
    quality = 0.8,
    maintainAspectRatio = true,
    maxRetries = 3,
    onRetry,
  } = options;

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageProcessingError(
      `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      ImageErrorCode.FILE_TOO_LARGE
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new ImageProcessingError(
      "File is not an image",
      ImageErrorCode.UNSUPPORTED_TYPE
    );
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    // Load image with retry
    const image = await loadImage(imageUrl);

    // Calculate dimensions
    let width = image.width;
    let height = image.height;

    if (maintainAspectRatio) {
      const aspectRatio = width / height;

      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
    } else {
      width = Math.min(width, maxWidth);
      height = Math.min(height, maxHeight);
    }

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Draw image
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new ImageProcessingError(
        "Failed to get canvas context",
        ImageErrorCode.CANVAS_CREATION_FAILED
      );
    }

    ctx.drawImage(image, 0, 0, width, height);

    // Create blob with retry
    const blob = await createBlob(canvas, "image/jpeg", quality);

    // Create thumbnail URL
    const thumbnailUrl = URL.createObjectURL(blob);

    return {
      thumbnailUrl,
      width,
      height,
      size: blob.size,
    };
  } finally {
    // Clean up original object URL
    URL.revokeObjectURL(imageUrl);
  }
};

export const cleanupThumbnail = (thumbnailUrl: string) => {
  URL.revokeObjectURL(thumbnailUrl);
};
