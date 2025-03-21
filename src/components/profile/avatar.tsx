import React, { useState, useRef } from "react";
import { useProfileStore } from "../../store/profileStore";
import {
  Avatar as UIAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface AvatarProps {
  url: string | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onUploadSuccess?: (url: string) => void;
}

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

const Avatar: React.FC<AvatarProps> = ({
  url,
  size = "md",
  editable = false,
  onUploadSuccess,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isLoading } = useProfileStore();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAvatarUrl = await uploadAvatar(file);
    if (newAvatarUrl && onUploadSuccess) {
      onUploadSuccess(newAvatarUrl);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    const profile = useProfileStore.getState().profile;
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return profile?.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="relative">
      <UIAvatar
        className={`${sizeMap[size]} ${editable ? "cursor-pointer" : ""}`}
        onMouseEnter={() => editable && setIsHovering(true)}
        onMouseLeave={() => editable && setIsHovering(false)}
        onClick={editable ? handleUploadClick : undefined}
      >
        {url ? <AvatarImage src={url} alt="Profile" /> : null}
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </UIAvatar>

      {editable && isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <Upload
            className="text-white"
            size={sizeMap[size] === "h-24 w-24" ? 24 : 16}
          />
        </div>
      )}

      {editable && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}

      {editable && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}
    </div>
  );
};

export { Avatar };
