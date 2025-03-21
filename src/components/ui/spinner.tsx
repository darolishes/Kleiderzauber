import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <div
        className={cn(
          "animate-spin rounded-full h-8 w-8 border-b-2 border-primary",
          className
        )}
      />
    </div>
  );
}
