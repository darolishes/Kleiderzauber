import * as React from "react";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ClothingItem } from "@/types/wardrobe";

interface ItemCardProps {
  item: ClothingItem;
  onSelect?: (item: ClothingItem) => void;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
}

export function ItemCard({ item, onSelect, onEdit, onDelete }: ItemCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === item.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.imageUrls.length - 1 : prev - 1
    );
  };

  return (
    <Card className="overflow-hidden">
      <div
        className="relative aspect-square cursor-pointer"
        onClick={() => onSelect?.(item)}
      >
        <img
          src={item.imageUrls[currentImageIndex]}
          alt={item.name}
          className="object-cover w-full h-full"
        />
        {item.imageUrls.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {item.imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 space-y-1">
          <p>{item.category}</p>
          <p>{item.color}</p>
          <p>{item.size}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
