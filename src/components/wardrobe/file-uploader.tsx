import { useEffect } from "react";
import Dashboard from "@uppy/dashboard";
import { useUppy } from "../providers/uppy-provider";
import { useToast } from "@/hooks/ui/use-toast";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

interface FileUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  onUploadError: (error: Error) => void;
}

export function FileUploader({
  onUploadComplete,
  onUploadError,
}: FileUploaderProps) {
  const { uppy } = useUppy();
  const { toast } = useToast();

  useEffect(() => {
    if (!uppy) return;

    // Initialize Dashboard plugin
    uppy.use(Dashboard, {
      inline: true,
      width: "100%",
      height: "400px",
      showProgressDetails: true,
      proudlyDisplayPoweredByUppy: false,
      note: "Images only, up to 10 MB",
    });

    // Handle successful uploads
    const completeHandler = (result: any) => {
      const urls = result.successful
        ?.map((file: any) => {
          if (!file.response?.body) return "";
          try {
            const response = JSON.parse(file.response.body);
            return response.url || "";
          } catch {
            return "";
          }
        })
        .filter(Boolean);

      if (urls.length > 0) {
        onUploadComplete(urls);
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${urls.length} file(s)`,
          variant: "default",
        });
      }
    };

    // Handle upload errors
    const errorHandler = (error: Error) => {
      onUploadError(error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file(s)",
        variant: "destructive",
      });
    };

    // Handle upload progress
    const progressHandler = (file: any, progress: any) => {
      if (!file || !progress.bytesTotal) return;
      const percent = Math.round(
        (progress.bytesUploaded / progress.bytesTotal) * 100
      );
      console.log(`${file.name}: ${percent}%`);
    };

    uppy.on("complete", completeHandler);
    uppy.on("error", errorHandler);
    uppy.on("upload-progress", progressHandler);

    return () => {
      uppy.off("complete", completeHandler);
      uppy.off("error", errorHandler);
      uppy.off("upload-progress", progressHandler);
    };
  }, [uppy, onUploadComplete, onUploadError, toast]);

  if (!uppy) return null;

  // The Dashboard UI is now handled by the plugin
  return <div id="uppy-dashboard" />;
}
