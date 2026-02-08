"use client";

import { CATEGORIES, CONDITIONS, SIZES } from "@/lib/categories";

interface SearchFiltersProps {
  query: string;
  category: string;
  size: string;
  condition: string;
  onQueryChange: (q: string) => void;
  onCategoryChange: (c: string) => void;
  onSizeChange: (s: string) => void;
  onConditionChange: (c: string) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors text-stone-800 placeholder:text-stone-400";

export default function SearchFilters({
  query,
  category,
  size,
  condition,
  onQueryChange,
  onCategoryChange,
  onSizeChange,
  onConditionChange,
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-linen-200 p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search listings..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={inputClass}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Size
          </label>
          <select
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
            className={inputClass}
          >
            <option value="">All Sizes</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => onConditionChange(e.target.value)}
            className={inputClass}
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
