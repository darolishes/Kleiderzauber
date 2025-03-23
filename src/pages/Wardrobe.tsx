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
import { UppyProvider } from "@/components/providers/uppy-provider";
import { FileUploader } from "@/components/wardrobe/file-uploader";

export default function Wardrobe() {
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

  const handleUpload = async (urls: string[]) => {
    setUploadedUrls(urls);
    setIsFormOpen(true);
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
    <UppyProvider
      supabaseUrl={import.meta.env.VITE_SUPABASE_URL}
      supabaseAnonKey={import.meta.env.VITE_SUPABASE_ANON_KEY}
      bucketName="wardrobe"
    >
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Wardrobe</h1>
          <Button onClick={() => setIsFormOpen(true)}>Add Item</Button>
        </div>

        <ItemFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full">
            <FileUploader
              onUploadComplete={handleUpload}
              onUploadError={(error) => {
                toast({
                  title: "Upload Error",
                  description: error.message,
                  variant: "destructive",
                });
              }}
            />
          </div>
          <ItemGrid
            items={items}
            onSelect={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {isFormOpen && (
          <ItemForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            item={selectedItem}
            uploadedUrls={uploadedUrls}
          />
        )}
      </div>
    </UppyProvider>
  );
}
