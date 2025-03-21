import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useWardrobeStore } from '../../store/wardrobeStore';

const UploadZone: React.FC = () => {
  const uploadItems = useWardrobeStore((state) => state.uploadItems);
  const loading = useWardrobeStore((state) => state.loading);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await uploadItems(acceptedFiles);
    },
    [uploadItems]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heif': ['.heif'],
    },
    multiple: true,
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-sm font-medium text-gray-900">
        {isDragActive
          ? 'Drop your clothing photos here'
          : 'Drag & drop clothing photos or click to select'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports JPG, PNG, and HEIF formats
      </p>
      {loading && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default UploadZone;