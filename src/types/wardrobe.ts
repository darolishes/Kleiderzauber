export interface ClothingItem {
  id: string;
  name: string;
  description?: string;
  category:
    | "Tops"
    | "Bottoms"
    | "Dresses"
    | "Outerwear"
    | "Shoes"
    | "Accessories";
  color: string;
  size: string;
  brand?: string;
  seasons: ("Spring" | "Summer" | "Fall" | "Winter" | "All Season")[];
  imageUrls: string[];
  thumbnailUrls: string[];
  imageDimensions?: Array<{
    width: number;
    height: number;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  dateAdded?: string;
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
  colors: string[];
  seasons: string[];
  brands: string[];
  sizes: string[];
  search?: string;
}

export interface ItemCardProps {
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete?: (id: string) => void;
}
