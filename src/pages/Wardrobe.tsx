import * as React from "react";
import { Filter, Grid, List, Plus } from "lucide-react";
import { useWardrobeStore } from "@/stores/wardrobe";
import {
  UploadZone,
  ItemCard,
  ItemGrid,
  ItemFilters,
  ItemDetails,
  ItemForm,
  type FormValues,
} from "@/components/wardrobe";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/ui/use-toast";
import type { ClothingItem, WardrobeFilters } from "@/types/wardrobe";
import { useState } from "react";

export function Wardrobe() {
  const {
    items,
    isLoading,
    error,
    filters,
    addItem,
    updateItem,
    deleteItem,
    setFilters,
    uploadItems,
  } = useWardrobeStore();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleUpload = async (files: File[]) => {
    try {
      const urls = await uploadItems(files);
      setUploadedUrls(urls);
      setIsFormOpen(true);
      return urls;
    } catch (error) {
      toast({
        title: "Failed to upload images",
        variant: "destructive",
      });
      return [];
    }
  };

  const handleFormSubmit = async (data: Partial<ClothingItem>) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
        toast({
          title: "Item updated successfully",
        });
      } else {
        const thumbnailUrls = uploadedUrls.map((url) =>
          url.replace("/wardrobe/", "/wardrobe/thumbnails/")
        );
        await addItem({
          ...data,
          imageUrls: uploadedUrls,
          thumbnailUrls,
          updatedAt: new Date().toISOString(),
        } as ClothingItem);
        toast({
          title: "Item added successfully",
        });
      }
      setIsFormOpen(false);
      setSelectedItem(undefined);
      setUploadedUrls([]);
    } catch (error) {
      toast({
        title: "Failed to save item",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (newFilters: Partial<WardrobeFilters>) => {
    setFilters(newFilters);
  };

  const handleEdit = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: ClothingItem) => {
    try {
      await deleteItem(item.id);
      toast({
        title: "Item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">My Wardrobe</h1>
        <UploadZone onUpload={handleUpload} />
      </div>

      <ItemFilters filters={filters} onFilterChange={handleFilterChange} />

      <ItemGrid
        items={items}
        onSelect={setSelectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <ItemForm
            item={selectedItem}
            uploadedUrls={uploadedUrls}
            onSubmit={handleFormSubmit}
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
