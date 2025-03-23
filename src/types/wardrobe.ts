export interface ClothingItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  size: string;
  brand?: string;
  seasons: string[];
  imageUrls: string[];
  thumbnailUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WardrobeFilters {
  category: string[];
  seasons: string[];
  colors: string[];
  brands: string[];
  searchQuery: string;
}

export interface WardrobeState {
  items: ClothingItem[];
  filters: WardrobeFilters;
  selectedItem: ClothingItem | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ItemCardProps {
  item: ClothingItem;
  onSelect?: (item: ClothingItem) => void;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (item: ClothingItem) => void;
}
