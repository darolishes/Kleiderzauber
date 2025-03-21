export interface ClothingItem {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url: string;
  brand: string;
  size: string;
  color: string;
  material: string;
  purchase_date: string;
  price: number;
  care_instructions: string;
  notes: string;
  categories: string[];
  subcategories: string[];
  seasons: string[];
  occasions: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type Category = 'Tops' | 'Bottoms' | 'Outerwear' | 'Shoes' | 'Accessories';
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';
export type Occasion = 'Casual' | 'Work' | 'Formal' | 'Sport' | 'Special';

export interface WardrobeFilters {
  categories: Category[];
  seasons: Season[];
  occasions: Occasion[];
  tags: string[];
  search: string;
}