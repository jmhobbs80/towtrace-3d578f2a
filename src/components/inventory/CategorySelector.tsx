
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  return (
    <div className="flex space-x-4">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelect(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
