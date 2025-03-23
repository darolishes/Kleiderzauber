import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { ClothingItem, WardrobeFilters } from "@/types/wardrobe";

interface WardrobeStore {
  items: ClothingItem[];
  filters: WardrobeFilters;
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<ClothingItem, "id" | "createdAt">) => Promise<void>;
  updateItem: (id: string, item: Partial<ClothingItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  uploadItems: (files: File[]) => Promise<string[]>;
  setFilters: (filters: Partial<WardrobeFilters>) => void;
}

export const useWardrobeStore = create<WardrobeStore>((set, get) => ({
  items: [],
  filters: {
    category: [],
    seasons: [],
    colors: [],
    brands: [],
    searchQuery: "",
  },
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("clothing_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ items: data || [] });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      // Generate thumbnail URLs from image URLs
      const thumbnailUrls = item.imageUrls.map((url) =>
        url.replace("/wardrobe/", "/wardrobe/thumbnails/")
      );

      const { data, error } = await supabase
        .from("clothing_items")
        .insert([{ ...item, thumbnailUrls }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        items: [data, ...state.items],
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, item) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("clothing_items")
        .update(item)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? data : i)),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("clothing_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  uploadItems: async (files) => {
    set({ isLoading: true, error: null });
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `wardrobe/${fileName}`;
        const thumbnailPath = `wardrobe/thumbnails/${fileName}`;

        // Upload original image
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URLs
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        const {
          data: { publicUrl: thumbnailUrl },
        } = supabase.storage.from("images").getPublicUrl(thumbnailPath);

        return { imageUrl: publicUrl, thumbnailUrl };
      });

      const results = await Promise.all(uploadPromises);
      return results.map((r) => r.imageUrl); // Return only image URLs for backward compatibility
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
}));
