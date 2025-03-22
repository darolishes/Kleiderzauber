import * as React from "react";
import { Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ItemCard } from "./item-card";
import type { ClothingItem } from "@/types/wardrobe";

interface ItemGridProps {
  items: ClothingItem[];
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
  className?: string;
  loading?: boolean;
}

export function ItemGrid({
  items,
  onEdit,
  onDelete,
  className,
  loading = false,
}: ItemGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Grid className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No items</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start by adding some items to your wardrobe.
        </p>
        <div className="mt-6">
          <Button>
            <span>Add items</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
