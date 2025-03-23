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
import type { WardrobeFilters } from "@/types/wardrobe";

interface ItemFiltersProps {
  filters: WardrobeFilters;
  onFilterChange: (filters: Partial<WardrobeFilters>) => void;
}

export function ItemFilters({ filters, onFilterChange }: ItemFiltersProps) {
  const [openCategory, setOpenCategory] = React.useState(false);
  const [openSeason, setOpenSeason] = React.useState(false);
  const [openColor, setOpenColor] = React.useState(false);
  const [openBrand, setOpenBrand] = React.useState(false);

  const handleSearchChange = (value: string) => {
    onFilterChange({ searchQuery: value });
  };

  const handleCategoryChange = (value: string) => {
    const categories = filters.category.includes(value)
      ? filters.category.filter((c) => c !== value)
      : [...filters.category, value];
    onFilterChange({ category: categories });
  };

  const handleSeasonChange = (value: string) => {
    const seasons = filters.seasons.includes(value)
      ? filters.seasons.filter((s) => s !== value)
      : [...filters.seasons, value];
    onFilterChange({ seasons });
  };

  const handleColorChange = (value: string) => {
    const colors = filters.colors.includes(value)
      ? filters.colors.filter((c) => c !== value)
      : [...filters.colors, value];
    onFilterChange({ colors });
  };

  const handleBrandChange = (value: string) => {
    const brands = filters.brands.includes(value)
      ? filters.brands.filter((b) => b !== value)
      : [...filters.brands, value];
    onFilterChange({ brands });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Input
        placeholder="Search items..."
        value={filters.searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="md:w-[200px]"
      />

      <Popover open={openCategory} onOpenChange={setOpenCategory}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCategory}
            className="justify-between"
          >
            {filters.category.length
              ? `${filters.category.length} categories`
              : "Category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
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
                  value={category}
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

      <Popover open={openSeason} onOpenChange={setOpenSeason}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSeason}
            className="justify-between"
          >
            {filters.seasons.length
              ? `${filters.seasons.length} seasons`
              : "Season"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search season..." />
            <CommandEmpty>No season found.</CommandEmpty>
            <CommandGroup>
              {["Spring", "Summer", "Fall", "Winter", "All Season"].map(
                (season) => (
                  <CommandItem
                    key={season}
                    value={season}
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

      <Popover open={openColor} onOpenChange={setOpenColor}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openColor}
            className="justify-between"
          >
            {filters.colors.length
              ? `${filters.colors.length} colors`
              : "Color"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search color..." />
            <CommandEmpty>No color found.</CommandEmpty>
            <CommandGroup>
              {[
                "Black",
                "White",
                "Red",
                "Blue",
                "Green",
                "Yellow",
                "Purple",
                "Pink",
                "Brown",
                "Gray",
              ].map((color) => (
                <CommandItem
                  key={color}
                  value={color}
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

      <Popover open={openBrand} onOpenChange={setOpenBrand}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBrand}
            className="justify-between"
          >
            {filters.brands.length
              ? `${filters.brands.length} brands`
              : "Brand"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search brand..." />
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              {[
                "Nike",
                "Adidas",
                "Puma",
                "Under Armour",
                "New Balance",
                "Reebok",
                "Vans",
                "Converse",
              ].map((brand) => (
                <CommandItem
                  key={brand}
                  value={brand}
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
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
