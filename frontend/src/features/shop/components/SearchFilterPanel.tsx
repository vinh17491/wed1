import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useExtraStore } from '../../store/useExtraStore';
import { useDebounce } from '../../hooks/useDebounce';

const CATEGORIES = ['All', 'Design', 'Video Editing', 'Music', 'Entertainment', 'Productivity'];

export function SearchFilterPanel() {
  const { filters, setFilters, resetFilters } = useExtraStore();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search premium tools..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <button 
          onClick={() => {
            setLocalSearch('');
            resetFilters();
          }}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" /> Reset Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-300">
            <Filter className="w-4 h-4" /> Category
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters({ category: cat })}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filters.category === cat 
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter (Simplified visual representation for now) */}
        <div className="w-full md:w-64">
          <div className="flex justify-between items-center mb-3 text-sm font-medium text-slate-300">
            <span>Price Range</span>
            <span className="text-emerald-400">${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="500" 
            step="10"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ priceRange: [0, parseInt(e.target.value)] })}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
