import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { ClothingItem, WardrobeFilters } from "@/types/wardrobe";
import { compressImage } from "@/utils/helpers/imageProcessing";
import { toast } from "@/hooks/ui/use-toast";

interface WardrobeState {
  items: ClothingItem[];
  filters: WardrobeFilters;
  loading: boolean;
  error: string | null;
  uploadItems: (files: File[]) => Promise<void>;
  updateItem: (id: string, data: Partial<ClothingItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchItems: () => Promise<void>;
  setFilters: (filters: Partial<WardrobeFilters>) => void;
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],
  filters: {
    categories: [],
    colors: [],
    seasons: [],
    search: "",
  },
  loading: false,
  error: null,

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

  updateItem: async (id: string, data: Partial<ClothingItem>) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("clothing_items")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      await get().fetchItems();
      toast({
        title: "Success",
        description: "Item updated successfully",
        variant: "default",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update item";
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

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("clothing_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
      toast({
        title: "Success",
        description: "Item deleted successfully",
        variant: "default",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete item";
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

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
}));
