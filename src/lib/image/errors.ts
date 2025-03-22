export class ImageProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: ImageErrorCode,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

export enum ImageErrorCode {
  LOAD_FAILED = "LOAD_FAILED",
  INVALID_FORMAT = "INVALID_FORMAT",
  CANVAS_CREATION_FAILED = "CANVAS_CREATION_FAILED",
  BLOB_CREATION_FAILED = "BLOB_CREATION_FAILED",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  UNSUPPORTED_TYPE = "UNSUPPORTED_TYPE",
}

export const getErrorMessage = (code: ImageErrorCode): string => {
  const messages: Record<ImageErrorCode, string> = {
    [ImageErrorCode.LOAD_FAILED]: "Failed to load image",
    [ImageErrorCode.INVALID_FORMAT]: "Invalid image format",
    [ImageErrorCode.CANVAS_CREATION_FAILED]: "Failed to create image canvas",
    [ImageErrorCode.BLOB_CREATION_FAILED]: "Failed to create image data",
    [ImageErrorCode.FILE_TOO_LARGE]: "Image file is too large",
    [ImageErrorCode.UNSUPPORTED_TYPE]: "Unsupported image type",
  };
  return messages[code];
};

export const isRetryableError = (error: ImageProcessingError): boolean => {
  const retryableCodes = [
    ImageErrorCode.LOAD_FAILED,
    ImageErrorCode.CANVAS_CREATION_FAILED,
    ImageErrorCode.BLOB_CREATION_FAILED,
  ];
  return retryableCodes.includes(error.code);
};
