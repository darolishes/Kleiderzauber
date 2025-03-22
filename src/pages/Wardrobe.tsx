import React, { useEffect, useState } from "react";
import { Filter, Grid, List, Plus } from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobeStore";
import {
  UploadZone,
  ItemCard,
  ItemGrid,
  ItemFilters,
  ItemDetails,
  ItemForm,
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
import type { ClothingItem, WardrobeFilters } from "@/types/wardrobe";

export const Wardrobe: React.FC = () => {
  const { items, loading, fetchItems, createItem, updateItem } =
    useWardrobeStore();
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<WardrobeFilters>({
    categories: [],
    colors: [],
    seasons: [],
    brands: [],
    sizes: [],
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const handleEditItem = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleFiltersChange = (filters: WardrobeFilters) => {
    setActiveFilters(filters);
    // TODO: Apply filters to items query
  };

  const handleUpload = async (files: File[]) => {
    // TODO: Implement file upload and item creation
    console.log("Files to upload:", files);
  };

  const handleFormSubmit = async (data: ClothingItem) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, data);
      } else {
        await createItem(data);
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const filteredItems = items; // TODO: Implement actual filtering logic

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Wardrobe</h1>
        <div className="flex items-center space-x-4">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={isFiltersOpen ? "text-primary" : "text-gray-500"}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <ItemFilters
                  filters={activeFilters}
                  onChange={handleFiltersChange}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="border-l border-gray-200 h-6" />

          <Button
            variant="outline"
            size="icon"
            className={viewMode === "grid" ? "text-primary" : "text-gray-500"}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={viewMode === "list" ? "text-primary" : "text-gray-500"}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </Button>

          <div className="border-l border-gray-200 h-6" />

          <Button onClick={handleCreateItem}>
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      <UploadZone onUpload={handleUpload} />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items in your wardrobe yet.</p>
          <p className="text-sm text-gray-400">
            Start by uploading some clothing photos above.
          </p>
        </div>
      ) : (
        <ItemGrid
          items={filteredItems}
          viewMode={viewMode}
          onItemClick={handleItemClick}
          onEditItem={handleEditItem}
        />
      )}

      {/* Item Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <ItemDetails
              item={selectedItem}
              onEdit={() => {
                setIsDetailsOpen(false);
                handleEditItem(selectedItem);
              }}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Item Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <ItemForm item={selectedItem} onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
