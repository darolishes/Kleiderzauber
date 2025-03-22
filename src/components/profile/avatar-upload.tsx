import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, { Crop } from "react-image-crop";
import imageCompression from "browser-image-compression";
import { useProfileStore } from "@/store/profileStore";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/ui/use-toast";
import { cn } from "@/lib/utils";
import "react-image-crop/dist/ReactCrop.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: Error) => void;
  showDeleteButton?: boolean;
}

export function AvatarUpload({
  currentAvatarUrl,
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess,
  onDeleteError,
  showDeleteButton = true,
}: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { uploadAvatar, deleteAvatar, uploadProgress, setUploadProgress } =
    useProfileStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "File must be an image (JPEG, PNG, or GIF)",
          variant: "destructive",
        });
        return;
      }

      try {
        // Create object URL for preview
        const objectUrl = URL.createObjectURL(file);
        setSelectedImage(objectUrl);
        setIsOpen(true);
      } catch (error) {
        console.error("Error processing image:", error);
        onUploadError?.(error as Error);
      }
    },
    [onUploadError]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": ACCEPTED_IMAGE_TYPES,
    },
    maxFiles: 1,
    disabled: uploadProgress.phase !== "idle",
  });

  const processAndUploadImage = async () => {
    if (!selectedImage || !imageRef.current) return;

    try {
      // Get the cropped canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2d context");

      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.95);
      });

      // Compress image
      setUploadProgress({ phase: "compressing", progress: 0 });
      const compressedFile = await imageCompression(
        new File([blob], "avatar.jpg", { type: "image/jpeg" }),
        {
          maxSizeMB: 1,
          maxWidthOrHeight: 400,
          useWebWorker: true,
          onProgress: (progress) => {
            setUploadProgress({
              phase: "compressing",
              progress: Math.round(progress * 100),
            });
          },
        }
      );

      // Upload to Supabase
      const avatarUrl = await uploadAvatar(compressedFile);
      if (avatarUrl) {
        onUploadSuccess?.(avatarUrl);
        setIsOpen(false);
        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      onUploadError?.(error as Error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
        setSelectedImage(null);
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      onDeleteSuccess?.();
      toast({
        title: "Success",
        description: "Avatar deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      onDeleteError?.(error as Error);
      toast({
        title: "Error",
        description: "Failed to delete avatar",
        variant: "destructive",
      });
    }
  };

  const getProgressMessage = () => {
    switch (uploadProgress.phase) {
      case "compressing":
        return "Processing...";
      case "uploading":
        return "Uploading...";
      case "deleting":
        return "Deleting...";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar
          src={currentAvatarUrl}
          alt="Profile picture"
          size="xl"
          isLoading={uploadProgress.phase !== "idle"}
        />
        <div className="flex-1">
          <div
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-4 transition-all duration-150 ease-in-out",
              {
                "border-primary/50 bg-primary/5": isDragActive && !isDragReject,
                "border-destructive/50 bg-destructive/5": isDragReject,
                "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5":
                  !isDragActive && !isDragReject,
                "opacity-50 cursor-not-allowed":
                  uploadProgress.phase !== "idle",
              }
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isDragActive && !isDragReject
                    ? "bg-primary/10 text-primary"
                    : isDragReject
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted"
                )}
              >
                <Icons.upload className="w-6 h-6" />
              </div>
              {isDragActive ? (
                isDragReject ? (
                  <p className="text-sm text-destructive">
                    This file type is not supported
                  </p>
                ) : (
                  <p className="text-sm">Drop the image here...</p>
                )
              ) : (
                <>
                  <p className="text-sm">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG or GIF (max. 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteButton && currentAvatarUrl && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDeleteAvatar}
          disabled={uploadProgress.phase !== "idle"}
        >
          Delete Avatar
        </Button>
      )}

      {uploadProgress.phase !== "idle" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{getProgressMessage()}</span>
            <span>{uploadProgress.progress}%</span>
          </div>
          <Progress value={uploadProgress.progress} />
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
            <DialogDescription>
              Drag to adjust the crop area for your avatar
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="mt-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Avatar preview"
                  className="max-h-[400px] w-auto mx-auto"
                />
              </ReactCrop>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={processAndUploadImage}>Upload</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
