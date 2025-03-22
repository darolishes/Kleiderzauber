import * as React from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { WardrobeFilters } from "@/types/wardrobe";

interface ItemFiltersProps {
  filters: WardrobeFilters;
  onFilterChange: (filters: WardrobeFilters) => void;
  className?: string;
}

const CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Shoes",
  "Accessories",
];

const SEASONS = ["Spring", "Summer", "Fall", "Winter", "All Season"];

const COLORS = [
  "Black",
  "White",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Brown",
];

export function ItemFilters({
  filters,
  onFilterChange,
  className,
}: ItemFiltersProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSeasonChange = (season: string, checked: boolean) => {
    const newSeasons = checked
      ? [...filters.seasons, season]
      : filters.seasons.filter((s) => s !== season);
    onFilterChange({ ...filters, seasons: newSeasons });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter((c) => c !== color);
    onFilterChange({ ...filters, colors: newColors });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      seasons: [],
      colors: [],
      tags: [],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.seasons.length > 0 ||
    filters.colors.length > 0 ||
    filters.tags.length > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2",
            hasActiveFilters && "bg-primary text-primary-foreground",
            className
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary-foreground/10 px-2 py-0.5 text-xs">
              {filters.categories.length +
                filters.seasons.length +
                filters.colors.length +
                filters.tags.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            Filters
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 lg:px-3"
              >
                Clear
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Seasons</h4>
            <div className="grid grid-cols-2 gap-2">
              {SEASONS.map((season) => (
                <div key={season} className="flex items-center space-x-2">
                  <Checkbox
                    id={`season-${season}`}
                    checked={filters.seasons.includes(season)}
                    onCheckedChange={(checked) =>
                      handleSeasonChange(season, checked as boolean)
                    }
                  />
                  <Label htmlFor={`season-${season}`}>{season}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Colors</h4>
            <div className="grid grid-cols-2 gap-2">
              {COLORS.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={filters.colors.includes(color)}
                    onCheckedChange={(checked) =>
                      handleColorChange(color, checked as boolean)
                    }
                  />
                  <Label htmlFor={`color-${color}`}>{color}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
