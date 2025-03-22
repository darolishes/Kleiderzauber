import { ClothingItem } from "@/types/wardrobe";

export interface WardrobeState {
  items: WardrobeItem[];
  loading: boolean;
  error: string | null;
  filters: WardrobeFilters;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags: string[];
  season: Season[];
  color: string;
  dateAdded: string;
}

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface WardrobeFilters {
  categories: string[];
  colors: string[];
  seasons: string[];
  brands: string[];
  sizes: string[];
}

export interface ItemCardProps {
  item: ClothingItem;
  onClick?: () => void;
  onEdit?: () => void;
}

export interface ItemGridProps {
  items: ClothingItem[];
  viewMode: "grid" | "list";
  onItemClick: (item: ClothingItem) => void;
  onEditItem: (item: ClothingItem) => void;
}

export interface ItemFiltersProps {
  filters: WardrobeFilters;
  onChange: (filters: WardrobeFilters) => void;
}

export interface ItemDetailsProps {
  item: ClothingItem;
  onEdit: () => void;
  onClose: () => void;
}

export interface ItemFormProps {
  item?: ClothingItem;
  onSubmit: (data: ClothingItem) => Promise<void>;
}

export interface UploadZoneProps {
  onUpload: (files: File[]) => Promise<void>;
}
