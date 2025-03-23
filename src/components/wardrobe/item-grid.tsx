import * as React from "react";
import { ItemCard } from "./item-card";
import type { ClothingItem } from "@/types/wardrobe";

interface ItemGridProps {
  items: ClothingItem[];
  onSelect?: (item: ClothingItem) => void;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
}

export function ItemGrid({ items, onSelect, onEdit, onDelete }: ItemGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
