import * as React from "react";
import { useWardrobeStore } from "@/stores/wardrobe";
import { ItemGrid } from "@/components/wardrobe/item-grid";
import { ItemFilters } from "@/components/wardrobe/item-filters";
import { UploadZone } from "@/components/wardrobe/upload-zone";
import { ItemForm, type FormValues } from "@/components/wardrobe/item-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/ui/use-toast";
import type { ClothingItem } from "@/types/wardrobe";

export default function WardrobePage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);
  const { items, filters, uploadItems, addItem, setFilters } =
    useWardrobeStore();

  const handleUpload = React.useCallback(
    async (files: File[]) => {
      try {
        const urls = await uploadItems(files);
        setUploadedFiles(files);
        setUploadedUrls(urls);
        setIsFormOpen(true);
        return urls;
      } catch (error) {
        toast({
          title: "Upload failed",
          description:
            error instanceof Error ? error.message : "Failed to upload images",
          variant: "destructive",
        });
        throw error;
      }
    },
    [uploadItems]
  );

  const handleFormSubmit = React.useCallback(
    async (data: FormValues) => {
      try {
        await addItem({
          ...data,
          imageUrls: uploadedUrls,
          thumbnailUrls: uploadedUrls.map((url) =>
            url.replace("/wardrobe/", "/wardrobe/thumbnails/")
          ),
          updatedAt: new Date().toISOString(),
        });
        setIsFormOpen(false);
        setUploadedFiles([]);
        setUploadedUrls([]);
        toast({
          title: "Item added",
          description: "Successfully added item to your wardrobe",
        });
      } catch (error) {
        toast({
          title: "Failed to add item",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while adding the item",
          variant: "destructive",
        });
      }
    },
    [addItem, uploadedUrls]
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <aside className="space-y-8">
          <ItemFilters filters={filters} onFilterChange={setFilters} />
          <UploadZone onUpload={handleUpload} />
        </aside>
        <main>
          <ItemGrid items={items} />
        </main>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <ItemForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            uploadedFiles={uploadedFiles}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
