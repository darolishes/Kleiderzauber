import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WardrobeFilters } from "@/types/wardrobe";

interface ItemFiltersProps {
  filters: WardrobeFilters;
  onFilterChange: (filters: Partial<WardrobeFilters>) => void;
}

export function ItemFilters({ filters, onFilterChange }: ItemFiltersProps) {
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [seasonOpen, setSeasonOpen] = React.useState(false);
  const [colorOpen, setColorOpen] = React.useState(false);
  const [brandOpen, setBrandOpen] = React.useState(false);

  const handleSearchChange = (value: string) => {
    onFilterChange({ searchQuery: value });
  };

  const handleCategoryChange = (value: string) => {
    const newCategories = filters.category.includes(value)
      ? filters.category.filter((c) => c !== value)
      : [...filters.category, value];
    onFilterChange({ category: newCategories });
  };

  const handleSeasonChange = (value: string) => {
    const newSeasons = filters.seasons.includes(value)
      ? filters.seasons.filter((s) => s !== value)
      : [...filters.seasons, value];
    onFilterChange({ seasons: newSeasons });
  };

  const handleColorChange = (value: string) => {
    const newColors = filters.colors.includes(value)
      ? filters.colors.filter((c) => c !== value)
      : [...filters.colors, value];
    onFilterChange({ colors: newColors });
  };

  const handleBrandChange = (value: string) => {
    const newBrands = filters.brands.includes(value)
      ? filters.brands.filter((b) => b !== value)
      : [...filters.brands, value];
    onFilterChange({ brands: newBrands });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Search items..."
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryOpen}
              className="w-full justify-between"
            >
              {filters.category.length > 0
                ? `${filters.category.length} selected`
                : "Select categories"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {[
                  "Tops",
                  "Bottoms",
                  "Dresses",
                  "Outerwear",
                  "Shoes",
                  "Accessories",
                ].map((category) => (
                  <CommandItem
                    key={category}
                    onSelect={() => handleCategoryChange(category)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.category.includes(category)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Seasons</Label>
        <Popover open={seasonOpen} onOpenChange={setSeasonOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={seasonOpen}
              className="w-full justify-between"
            >
              {filters.seasons.length > 0
                ? `${filters.seasons.length} selected`
                : "Select seasons"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search seasons..." />
              <CommandEmpty>No season found.</CommandEmpty>
              <CommandGroup>
                {["Spring", "Summer", "Fall", "Winter", "All Season"].map(
                  (season) => (
                    <CommandItem
                      key={season}
                      onSelect={() => handleSeasonChange(season)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.seasons.includes(season)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {season}
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Colors</Label>
        <Popover open={colorOpen} onOpenChange={setColorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={colorOpen}
              className="w-full justify-between"
            >
              {filters.colors.length > 0
                ? `${filters.colors.length} selected`
                : "Select colors"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search colors..." />
              <CommandEmpty>No color found.</CommandEmpty>
              <CommandGroup>
                {[
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
                ].map((color) => (
                  <CommandItem
                    key={color}
                    onSelect={() => handleColorChange(color)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.colors.includes(color)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {color}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Brands</Label>
        <Popover open={brandOpen} onOpenChange={setBrandOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={brandOpen}
              className="w-full justify-between"
            >
              {filters.brands.length > 0
                ? `${filters.brands.length} selected`
                : "Select brands"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search brands..." />
              <CommandEmpty>No brand found.</CommandEmpty>
              <CommandGroup>
                {/* TODO: Replace with actual brand list from API */}
                {["Nike", "Adidas", "Puma", "Under Armour", "New Balance"].map(
                  (brand) => (
                    <CommandItem
                      key={brand}
                      onSelect={() => handleBrandChange(brand)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.brands.includes(brand)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {brand}
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
