import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type {
  ClothingItem,
  WardrobeFilters,
  WardrobeState,
} from "@/types/wardrobe";
import { compressImage } from "@/utils/helpers/imageProcessing";
import { toast } from "@/hooks/ui/use-toast";

interface WardrobeStore extends WardrobeState {
  fetchItems: () => Promise<void>;
  createItem: (item: Partial<ClothingItem>) => Promise<void>;
  updateItem: (id: string, item: Partial<ClothingItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setFilters: (filters: Partial<WardrobeFilters>) => void;
  uploadItems: (files: File[]) => Promise<void>;
}

export const useWardrobeStore = create<WardrobeStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  filters: {
    categories: [],
    colors: [],
    seasons: [],
    brands: [],
    sizes: [],
  },

  uploadItems: async (files: File[]) => {
    set({ loading: true, error: null });
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      const uploadPromises = files.map(async (file) => {
        const compressedFile = await compressImage(file);
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("wardrobe")
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("wardrobe")
          .getPublicUrl(fileName);

        return {
          user_id: user.id,
          image_url: publicUrl.publicUrl,
          name: file.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      const uploadedItems = await Promise.all(uploadPromises);
      const { error: dbError } = await supabase
        .from("clothing_items")
        .insert(uploadedItems);

      if (dbError) throw dbError;

      await get().fetchItems();
      toast({
        title: "Success",
        description: "Items uploaded successfully",
        variant: "default",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload items";
      set({ error: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("clothing_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ items: data as ClothingItem[] });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch items";
      set({ error: message });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      set({ loading: false });
    }
  },

  createItem: async (item: Partial<ClothingItem>) => {
    set({ loading: true, error: null });
    try {
      const newItem: ClothingItem = {
        id: Date.now().toString(),
        name: item.name || "",
        description: item.description,
        category: item.category || "Tops",
        color: item.color || "",
        size: item.size || "",
        brand: item.brand,
        seasons: item.seasons || [],
        imageUrls: item.imageUrls || [],
        thumbnailUrls: item.thumbnailUrls || [],
        imageDimensions: item.imageDimensions,
        tags: item.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const items = [...get().items, newItem];
      set({ items });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (id: string, item: Partial<ClothingItem>) => {
    set({ loading: true, error: null });
    try {
      const items = get().items.map((existingItem) =>
        existingItem.id === id
          ? {
              ...existingItem,
              ...item,
              updatedAt: new Date().toISOString(),
            }
          : existingItem
      );
      set({ items });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const items = get().items.filter((item) => item.id !== id);
      set({ items });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setFilters: (filters: Partial<WardrobeFilters>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },
}));
