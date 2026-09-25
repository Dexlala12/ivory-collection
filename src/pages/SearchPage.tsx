import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, SlidersHorizontal, ChevronDown, HelpCircle, X } from 'lucide-react';
import { Product, ActivePage } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import ProductCard from '../components/ProductCard';

interface SearchPageProps {
  initialQuery: string;
  onViewProductDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  setActivePage: (page: ActivePage) => void;
  setActiveCategory: (catId: string) => void;
}

const POPULAR_SEARCHES = ['PARKA', 'HOODIE', 'RUNNER', 'TIGHTS', 'UTILITY', 'COMPRESSION'];

export default function SearchPage({
  initialQuery,
  onViewProductDetails,
  onAddToCart,
  setActivePage,
  setActiveCategory
}: SearchPageProps) {
  const { products: PRODUCTS } = useSiteContent();
  const [query, setQuery] = useState(initialQuery || '');
  const [activeSearch, setActiveSearch] = useState(initialQuery || '');
  const [sortBy, setSortBy] = useState('featured');

  // Sync state if initialQuery changes
  useMemo(() => {
    setQuery(initialQuery);
    setActiveSearch(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(query);
  };

  const selectSuggestion = (term: string) => {
    setQuery(term);
    setActiveSearch(term);
  };

  // Perform dynamic search on title, category, description, and highlights
  const searchResults = useMemo(() => {
    if (!activeSearch.trim()) return [];
    const term = activeSearch.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.highlights.some(h => h.toLowerCase().includes(term))
      );
    });
  }, [activeSearch]);

  // Sort search results
  const sortedResults = useMemo(() => {
    const list = [...searchResults];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [searchResults, sortBy]);

  // If no results, suggest featured collections
  const suggestedProducts = useMemo(() => {
    return PRODUCTS.slice(0, 3);
  }, []);

  return (
    <div className="bg-white text-black py-8 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Search Bar Input Container */}
        <div className="max-w-2xl mx-auto space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
            <input
              type="text"
              placeholder="SEARCH THE IVORY SYSTEM APPAREL"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-black/15 focus:border-black px-5 py-4 text-xs font-mono tracking-widest outline-none rounded-none uppercase placeholder:text-zinc-400"
            />
            <button
              type="submit"
              className="bg-black hover:bg-black/85 text-white px-8 text-xs font-mono tracking-widest font-bold uppercase rounded-none flex items-center space-x-2 shrink-0"
            >
              <Search size={14} />
              <span className="hidden sm:inline">SEARCH</span>
            </button>
          </form>

          {/* Popular searches suggestions */}
          <div className="flex flex-wrap items-baseline gap-2.5 text-[9px] font-mono text-black/50 uppercase">
            <span>RECOMMENDED SHORTCUTS:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => selectSuggestion(term)}
                className={`hover:text-black transition-colors border-b hover:border-black pb-0.5 ${
                  activeSearch.toUpperCase() === term ? 'text-black border-black font-bold' : 'border-transparent'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        {activeSearch && (
          <div className="flex flex-col sm:flex-row justify-between items-baseline border-y border-black/10 py-5 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase block">QUERY TERMINAL ECHO</span>
              <h1 className="text-sm font-bold tracking-widest uppercase">
                SEARCHING RESULTS FOR <span className="font-mono font-black text-black">"{activeSearch}"</span>
              </h1>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 text-xs font-mono">
              <span className="text-[10px] tracking-wider text-black/50 uppercase">
                {searchResults.length} MATCHES RESOLVED
              </span>

              {searchResults.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] tracking-widest text-black/40 uppercase">SORT /</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-black/15 hover:border-black px-3 py-2.5 text-[10px] font-bold tracking-wider rounded-none outline-none pr-8 appearance-none cursor-pointer uppercase"
                    >
                      <option value="featured">RELEVANCE</option>
                      <option value="price-asc">PRICE: LOW TO HIGH</option>
                      <option value="price-desc">PRICE: HIGH TO LOW</option>
                      <option value="rating">HIGH RATING</option>
                    </select>
                    <ChevronDown size={11} className="absolute right-3 top-3.5 pointer-events-none text-black" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Results Display Stage */}
        {!activeSearch ? (
          <div className="py-12 text-center uppercase font-mono text-xs text-black/40 space-y-4">
            <p>Enter a query in the terminal above to scour the IVORY apparel register.</p>
            <div className="flex justify-center">
              <button
                onClick={() => { selectSuggestion('PARKA'); }}
                className="bg-black text-[#F4F4F5] px-6 py-3 tracking-widest font-bold font-mono text-[10px]"
              >
                BROWSE PRIMARY PARKA CAPSULE
              </button>
            </div>
          </div>
        ) : searchResults.length === 0 ? (
          /* NO RESULTS STATE */
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="py-16 text-center space-y-4 border border-black/5 rounded-sm bg-zinc-50">
              <p className="text-xl">⚠️</p>
              <h3 className="text-xs font-mono tracking-widest text-black/50 uppercase font-bold">SYSTEM SEARCH EXCLUSION</h3>
              <p className="text-xs text-black/40 max-w-sm mx-auto leading-relaxed">
                Your search query did not compile with any products in our catalog. Try alternative phrases or reset system classifications.
              </p>
              <button
                onClick={() => { setQuery(''); setActiveSearch(''); }}
                className="bg-black text-[#F4F4F5] hover:bg-black/85 px-6 py-3 text-[10px] font-mono tracking-widest font-bold uppercase transition-all"
              >
                FLUSH SEARCH BAR
              </button>
            </div>

            {/* Suggested Searches collections */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block mb-1">SYSTEM CO-SELECTIONS</span>
                <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase text-black">POPULAR RELEASES BATCH</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {suggestedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onViewDetails={onViewProductDetails}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* POSITIVE RESULTS STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedResults.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewProductDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
