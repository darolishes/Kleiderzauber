import React, { useEffect, useState } from "react";
import { Filter, Grid, List } from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobeStore";
import { UploadZone, ItemCard } from "@/features/wardrobe";
import type { ClothingItem } from "@/types/wardrobe";

export const Wardrobe: React.FC = () => {
  const { items, loading, fetchItems } = useWardrobeStore();
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEditItem = (item: ClothingItem) => {
    setSelectedItem(item);
    // We'll implement the edit modal later
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Wardrobe</h1>
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => {}} // We'll implement filters later
          >
            <Filter className="h-5 w-5" />
          </button>
          <div className="border-l border-gray-200 h-6" />
          <button
            className={`p-2 rounded-md hover:bg-gray-100 ${
              viewMode === "grid" ? "text-indigo-600" : "text-gray-500"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-md hover:bg-gray-100 ${
              viewMode === "list" ? "text-indigo-600" : "text-gray-500"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <UploadZone />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items in your wardrobe yet.</p>
          <p className="text-sm text-gray-400">
            Start by uploading some clothing photos above.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onEdit={handleEditItem} />
          ))}
        </div>
      )}
    </div>
  );
};
