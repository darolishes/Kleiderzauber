export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags: string[];
  season: string[];
  color: string;
  dateAdded: string;
  metadata?: Record<string, unknown>;
}

export interface WardrobeState {
  items: ClothingItem[];
  loading: boolean;
  error: string | null;
  filters: WardrobeFilters;
}

export interface WardrobeFilters {
  categories: string[];
  seasons: string[];
  colors: string[];
  tags: string[];
}

export interface ItemCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete?: (id: string) => void;
}
