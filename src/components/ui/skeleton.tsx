import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "rectangle" | "circle";
}

export function Skeleton({
  className,
  shape = "rectangle",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/50",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
      </div>
    </div>
  );
}
