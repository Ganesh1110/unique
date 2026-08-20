'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'BEST_SELLING', label: 'Best Selling' },
  { value: 'CREATED_DESC', label: 'Newest Arrivals' },
  { value: 'PRICE_ASC', label: 'Price: Low to High' },
  { value: 'PRICE_DESC', label: 'Price: High to Low' },
  { value: 'TITLE_ASC', label: 'Name: A to Z' },
  { value: 'TITLE_DESC', label: 'Name: Z to A' },
];

export function SortDropdown({ currentSort }: { currentSort?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSort = currentSort || searchParams.get('sort') || 'BEST_SELLING';
  const activeLabel = SORT_OPTIONS.find((opt) => opt.value === activeSort)?.label || 'Best Selling';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page'); // Reset to page 1 on sort change
    window.location.assign(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <Filter className="pointer-events-none absolute left-4 h-4 w-4 text-faint" aria-hidden="true" />
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        name="sort"
        value={activeSort}
        onChange={handleChange}
        aria-label={`Sort products, currently sorted by ${activeLabel}`}
        className={cn(
          'cursor-pointer appearance-none rounded-full border border-ink/15 bg-sunken py-2 pl-11 pr-10 text-body-sm font-medium text-ink',
          'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors duration-fast'
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 h-4 w-4 text-faint"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}