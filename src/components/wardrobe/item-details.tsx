import * as React from "react";
import { Calendar, Tag, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClothingItem } from "@/types/wardrobe";

interface ItemDetailsProps {
  item: ClothingItem | null;
  onClose: () => void;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
  className?: string;
}

export function ItemDetails({
  item,
  onClose,
  onEdit,
  onDelete,
  className,
}: ItemDetailsProps) {
  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className={cn("sm:max-w-[600px]", className)}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {item.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            {item.category}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          {/* Image */}
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="grid gap-4">
            {/* Seasons */}
            <div className="flex flex-wrap gap-2">
              {item.season?.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>

            {/* Colors and Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.color}</span>
              {item.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Date Added */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Added {format(new Date(item.dateAdded), "MMMM d, yyyy")}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(item)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => onDelete(item)}
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
