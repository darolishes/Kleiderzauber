import { createContext, useContext, useEffect, useState } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";

interface UppyContextType {
  uppy: Uppy | null;
}

const UppyContext = createContext<UppyContextType>({ uppy: null });

export const useUppy = () => {
  const context = useContext(UppyContext);
  if (!context) {
    throw new Error("useUppy must be used within an UppyProvider");
  }
  return context;
};

interface UppyProviderProps {
  children: React.ReactNode;
  supabaseUrl: string;
  supabaseAnonKey: string;
  bucketName: string;
}

export function UppyProvider({
  children,
  supabaseUrl,
  supabaseAnonKey,
  bucketName,
}: UppyProviderProps) {
  const [uppy, setUppy] = useState<Uppy | null>(null);

  useEffect(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ["image/*"],
      },
      autoProceed: false,
      allowMultipleUploadBatches: true,
    });

    // Configure TUS plugin for resumable uploads
    uppyInstance.use(Tus, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        "x-upsert": "true",
      },
      chunkSize: 6 * 1024 * 1024, // 6MB chunks
      retryDelays: [0, 1000, 3000, 5000],
      metadata: {
        bucketName,
        objectName: "${fileName}", // Will be replaced with actual filename
      },
    });

    setUppy(uppyInstance);

    return () => {
      // Clean up Uppy instance
      uppyInstance.getFiles().forEach((file) => {
        uppyInstance.removeFile(file.id);
      });
    };
  }, [supabaseUrl, supabaseAnonKey, bucketName]);

  return (
    <UppyContext.Provider value={{ uppy }}>{children}</UppyContext.Provider>
  );
}
