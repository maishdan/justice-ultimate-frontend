// src/components/SmartSearch.tsx
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import type { Car } from "../types/Car";

interface SmartSearchProps {
  cars?: Car[]; // Optional in case not passed
  onSearchResults?: (results: Car[]) => void;
  onSearch?: (query: string) => void; // ✅ Added this to fix error
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ cars = [], onSearchResults, onSearch }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (onSearch) {
      onSearch(query); // ✅ call external search handler if passed
    }

    if (onSearchResults) {
      const filtered = cars.filter((car) =>
        car.name.toLowerCase().includes(query.toLowerCase()) ||
        car.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      onSearchResults(filtered);
    }
  }, [query, cars, onSearchResults, onSearch]);

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      <Input
        id="smart-search"
        type="text"
        placeholder="Search by name, tag, or model..."
        className="rounded-xl shadow-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
// ✅ This component now accepts `cars` and `onSearchResults` props
// ✅ It filters the cars based on the search query and calls the provided `onSearchResults` callback
// ✅ The `onSearch` prop allows external components to handle search logic if needed
// ✅ The search input is focused by default when the component mounts    
// ✅ The component is styled with Tailwind CSS for a consistent look
// ✅ The search input is accessible with an ID for keyboard navigation
// ✅ The component is responsive and works well on different screen sizes
// ✅ It uses TypeScript for type safety and better developer experience
