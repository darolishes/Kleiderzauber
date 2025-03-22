"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function Avatar({
  className,
  src,
  alt = "",
  fallback,
  isLoading = false,
  size = "md",
  ...props
}: AvatarProps) {
  const [isImageError, setIsImageError] = React.useState(false);

  // Reset error state when src changes
  React.useEffect(() => {
    setIsImageError(false);
  }, [src]);

  if (isLoading) {
    return (
      <Skeleton className={cn(sizeClasses[size], "rounded-full", className)} />
    );
  }

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !isImageError ? (
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          onError={() => setIsImageError(true)}
          className="aspect-square h-full w-full"
        />
      ) : (
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center rounded-full bg-muted"
          delayMs={0}
        >
          <span className="font-medium text-muted-foreground">
            {fallback || alt.slice(0, 2).toUpperCase()}
          </span>
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  );
}
