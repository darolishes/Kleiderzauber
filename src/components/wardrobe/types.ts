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
  seasons: Season[];
  colors: string[];
  tags: string[];
}

export interface ItemCardProps {
  item: WardrobeItem;
  onEdit: (item: WardrobeItem) => void;
  onDelete: (id: string) => void;
}

export interface UploadZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}
