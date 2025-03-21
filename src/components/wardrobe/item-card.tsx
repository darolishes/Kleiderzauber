import React from "react";
import type { ClothingItem } from "@/types/wardrobe";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface ItemCardProps {
  item: ClothingItem;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription>{item.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs rounded-full bg-secondary">
            {item.color}
          </span>
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-secondary/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
