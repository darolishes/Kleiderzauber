import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
}

export const compressImage = async (
  file: File,
  options: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  }
): Promise<File> => {
  try {
    return await imageCompression(file, {
      ...options,
      useWebWorker: true,
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

export const generateThumbnail = async (
  file: File,
  maxSize: number = 200
): Promise<File> => {
  return await compressImage(file, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: maxSize,
  });
};