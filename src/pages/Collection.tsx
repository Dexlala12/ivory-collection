import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, X, RefreshCw, Grid2X2 } from 'lucide-react';
import { Product, FilterState, ActivePage } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import ProductCard from '../components/ProductCard';

interface CollectionProps {
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  activeActivity: string;
  setActiveActivity: (actId: string) => void;
  onViewProductDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  setActivePage: (page: ActivePage) => void;
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '8', '9', '10', '11', '12', 'One Size'];
const ALL_COLORS = [
  { name: 'Obsidian Black', hex: '#111111' },
  { name: 'Pure Chalk White', hex: '#FFFFFF' },
  { name: 'Structured Off-White', hex: '#F4F4F5' },
  { name: 'Charcoal Asphalt', hex: '#374151' },
  { name: 'Ghost Gray', hex: '#9CA3AF' }
];

export default function Collection({
  activeCategory,
  setActiveCategory,
  activeActivity,
  setActiveActivity,
  onViewProductDetails,
  onAddToCart,
  setActivePage
}: CollectionProps) {
  const { products: PRODUCTS, categoriesWithAll: CATEGORIES, activities: ACTIVITIES } = useSiteContent();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Local filter states
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Sync category title & description
  const categoryMeta = useMemo(() => {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    if (!cat) return { name: 'ALL PRODUCTS', desc: 'Our full directory of premium compression layers, technical trousers, utility outerwear, and modular footwear.' };
    switch (cat.id) {
      case 'outerwear':
        return { name: 'UTILITY OUTERWEAR', desc: 'Hydrophobic modular shells, laser-cut parkas, and structural storm coats.' };
      case 'tops':
        return { name: 'TOPS & HOODIES', desc: 'Heavyweight organic cotton loopback fleece hoodies, crewnecks, and circular knit tees.' };
      case 'bottoms':
        return { name: 'TECHNICAL BOTTOMS', desc: 'Locked compression tights, four-way stretch dynamic pants, and lightweight training shorts.' };
      case 'footwear':
        return { name: 'FOOTWEAR LAB', desc: 'Carbon-fiber spring-matrix trail runners and high-grip rubberized modular sneakers.' };
      case 'accessories':
        return { name: 'UTILITY ACCESSORIES', desc: 'Ballistic nylon carrying gear, technical duffels, and protective modular bags.' };
      default:
        return { name: 'ALL APPAREL', desc: 'The complete IVORY structural ecosystem. Premium performance wear compiled with strict minimal geometry.' };
    }
  }, [activeCategory]);

  // Combined Filtering logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // 2. Activity Filter
      if (activeActivity !== 'all' && !product.activities.includes(activeActivity)) {
        return false;
      }

      // 3. Size Filter
      if (selectedSizes.length > 0 && !product.sizes.some(s => selectedSizes.includes(s))) {
        return false;
      }

      // 4. Color Filter
      if (selectedColors.length > 0 && !product.colors.some(c => selectedColors.includes(c.name))) {
        return false;
      }

      // 5. Price Filter
      if (product.price > maxPrice) {
        return false;
      }

      // 6. Availability Filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [activeCategory, activeActivity, selectedSizes, selectedColors, maxPrice, onlyInStock]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'alphabetical':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default: // 'featured'
        return list; // default order from products list
    }
  }, [filteredProducts, sortBy]);

  // Pagination bounds
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(350);
    setOnlyInStock(false);
    setActiveCategory('all');
    setActiveActivity('all');
    setCurrentPage(1);
  };

  const removeSizeChip = (size: string) => {
    setSelectedSizes(prev => prev.filter(s => s !== size));
  };

  const removeColorChip = (color: string) => {
    setSelectedColors(prev => prev.filter(c => c !== color));
  };

  const hasActiveFilters = 
    selectedSizes.length > 0 || 
    selectedColors.length > 0 || 
    maxPrice < 350 || 
    onlyInStock || 
    activeCategory !== 'all' || 
    activeActivity !== 'all';

  return (
    <div className="bg-white text-black animate-in fade-in duration-300">
      
      {/* 1. SECONDARY PROMO STRIP */}
      <div className="bg-zinc-100 py-3.5 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono tracking-widest text-black/75 uppercase gap-2">
          <button 
            onClick={() => { setActiveActivity('running'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-black hover:underline flex items-center space-x-1"
          >
            <span>🔥 BASE COMPRESSION DISPATCHES ON TRACK</span>
            <span>→</span>
          </button>
          <div className="hidden sm:block text-black/20">|</div>
          <button 
            onClick={() => { setActiveCategory('outerwear'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-black hover:underline flex items-center space-x-1"
          >
            <span>🛡️ INTEGRATE SHIELD JACKETS AND RAIN COATS</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        
        {/* 2. COLLECTION HEADER */}
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-black/40 uppercase block">CORE REGISTRY / APPAREL</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-none text-black">
            {categoryMeta.name}
          </h1>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-sans max-w-2xl">
            {categoryMeta.desc}
          </p>
        </div>

        {/* 3. FILTER & SORT BAR */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center border-y border-black/10 py-5 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Toggle Button */}
            <button
              id="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 border px-4 py-3.5 text-[10px] font-mono tracking-widest font-bold transition-all ${
                showFilters || hasActiveFilters ? 'border-black bg-black text-[#F4F4F5]' : 'border-black/15 hover:border-black text-black'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>{showFilters ? 'CONCEAL FILTERS' : 'EXPAND FACET FILTERS'}</span>
            </button>

            {/* Quick Category Quick-Select Chips */}
            <div className="hidden sm:flex items-center space-x-2">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 text-[10px] font-mono tracking-wider transition-all border ${
                    activeCategory === cat.id 
                      ? 'border-black bg-zinc-100 font-bold' 
                      : 'border-transparent text-black/50 hover:text-black'
                  }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
            {/* Live product count label */}
            <span className="text-[10px] tracking-wider text-black/50 uppercase">
              {filteredProducts.length} PRODUCTS REGISTERED
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] tracking-widest text-black/40 uppercase hidden sm:inline">SORT /</span>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-black/15 hover:border-black px-3 py-3 text-[10px] font-bold tracking-wider rounded-none outline-none pr-8 appearance-none cursor-pointer uppercase"
                >
                  <option value="featured">FEATURED FEED</option>
                  <option value="price-asc">PRICE: ASCENDING</option>
                  <option value="price-desc">PRICE: DESCENDING</option>
                  <option value="rating">HIGH RATING</option>
                  <option value="alphabetical">ALPHABETICAL (A-Z)</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-3.5 pointer-events-none text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. EXPANDABLE FACET FILTERS DRAWER */}
        {showFilters && (
          <div 
            id="facet-filters-drawer"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 bg-zinc-50 border border-black/5 p-6 sm:p-8 animate-in slide-in-from-top-4 duration-300"
          >
            {/* Sizing Filter block */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono tracking-[0.2em] text-black/50 uppercase font-bold">BY SELECT SIZE</h4>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SIZES.map((size) => {
                  const isSel = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`border px-2.5 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all ${
                        isSel 
                          ? 'border-black bg-black text-[#F4F4F5] font-bold' 
                          : 'border-black/10 hover:border-black/30 bg-white text-black/75'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Filter block */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono tracking-[0.2em] text-black/50 uppercase font-bold">BY SELECT COLOR</h4>
              <div className="grid grid-cols-2 gap-2">
                {ALL_COLORS.map((col) => {
                  const isSel = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      onClick={() => toggleColor(col.name)}
                      className={`flex items-center space-x-2 border p-2 text-[10px] font-mono tracking-wider transition-all text-left uppercase ${
                        isSel ? 'border-black bg-black text-white font-bold' : 'border-black/10 hover:border-black/30 bg-white'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 border border-black/10 inline-block" 
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price slider block */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono tracking-[0.2em] text-black/50 uppercase font-bold flex justify-between">
                <span>PRICE BARRIER</span>
                <span className="text-black font-bold font-mono">${maxPrice} LIMIT</span>
              </h4>
              <div className="space-y-2 py-2">
                <input
                  type="range"
                  min={70}
                  max={350}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-black h-1 bg-black/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-black/40">
                  <span>$70.00</span>
                  <span>$350.00</span>
                </div>
              </div>
            </div>

            {/* Availability & Quick resets */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono tracking-[0.2em] text-black/50 uppercase font-bold">FILTERS TOGGLES</h4>
                <label className="flex items-center space-x-3 text-xs font-mono text-black/75 cursor-pointer uppercase select-none">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => {
                      setOnlyInStock(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <span>EXCLUDE OUT OF STOCK</span>
                </label>
              </div>

              <button
                onClick={resetAllFilters}
                className="w-full border border-red-200 hover:border-red-500 hover:bg-red-50/50 text-red-600 font-mono text-[9px] tracking-widest font-bold uppercase py-3 flex items-center justify-center space-x-1.5 transition-all"
              >
                <RefreshCw size={11} />
                <span>FLUSH ALL SELECTIONS</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. APPLIED FILTER CHIPS */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in duration-200">
            <span className="text-[9px] font-mono tracking-[0.25em] text-black/40 uppercase font-bold mr-2">APPLIED /</span>
            
            {activeCategory !== 'all' && (
              <span className="bg-zinc-100 border border-black/5 text-[9px] font-mono text-black uppercase pl-2.5 pr-1.5 py-1 flex items-center gap-1.5">
                <span>CATEGORY: {activeCategory}</span>
                <button onClick={() => { setActiveCategory('all'); setCurrentPage(1); }} className="hover:bg-black/10 p-0.5 rounded-full"><X size={10} /></button>
              </span>
            )}

            {activeActivity !== 'all' && (
              <span className="bg-zinc-100 border border-black/5 text-[9px] font-mono text-black uppercase pl-2.5 pr-1.5 py-1 flex items-center gap-1.5">
                <span>SYSTEM: {activeActivity}</span>
                <button onClick={() => { setActiveActivity('all'); setCurrentPage(1); }} className="hover:bg-black/10 p-0.5 rounded-full"><X size={10} /></button>
              </span>
            )}

            {selectedSizes.map((size) => (
              <span key={size} className="bg-zinc-100 border border-black/5 text-[9px] font-mono text-black uppercase pl-2.5 pr-1.5 py-1 flex items-center gap-1.5">
                <span>SIZE: {size}</span>
                <button onClick={() => removeSizeChip(size)} className="hover:bg-black/10 p-0.5 rounded-full"><X size={10} /></button>
              </span>
            ))}

            {selectedColors.map((col) => (
              <span key={col} className="bg-zinc-100 border border-black/5 text-[9px] font-mono text-black uppercase pl-2.5 pr-1.5 py-1 flex items-center gap-1.5">
                <span>COLOR: {col}</span>
                <button onClick={() => removeColorChip(col)} className="hover:bg-black/10 p-0.5 rounded-full"><X size={10} /></button>
              </span>
            ))}

            {maxPrice < 350 && (
              <span className="bg-zinc-100 border border-black/5 text-[9px] font-mono text-black uppercase pl-2.5 pr-1.5 py-1 flex items-center gap-1.5">
                <span>UNDER: ${maxPrice}</span>
                <button onClick={() => { setMaxPrice(350); setCurrentPage(1); }} className="hover:bg-black/10 p-0.5 rounded-full"><X size={10} /></button>
              </span>
            )}

            {onlyInStock && (
              <span className="bg-zinc-100 border border-black/5 text-[9px] font-mono text-black uppercase pl-2.5 pr-1.5 py-1 flex items-center gap-1.5">
                <span>IN STOCK ONLY</span>
                <button onClick={() => { setOnlyInStock(false); setCurrentPage(1); }} className="hover:bg-black/10 p-0.5 rounded-full"><X size={10} /></button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-[9px] font-mono tracking-widest text-black/50 hover:text-black hover:underline uppercase font-bold py-1 px-2.5"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        )}

        {/* 6. PRODUCT GRID */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-black/5 rounded-sm bg-zinc-50">
            <p className="text-xl">🔍</p>
            <h3 className="text-sm font-bold tracking-widest text-black/50 uppercase">NO CLASSIFIED MATCHES DETECTED</h3>
            <p className="text-xs text-black/40 max-w-sm mx-auto leading-relaxed">
              No products correspond to the selected filters. Reduce facet specifications or reset the directory.
            </p>
            <button
              onClick={resetAllFilters}
              className="bg-black text-[#F4F4F5] hover:bg-black/85 px-6 py-3 text-[10px] font-mono tracking-widest font-bold uppercase transition-all"
            >
              RESET TO ALL PRODUCTS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewProductDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

        {/* 7. PAGINATION CONTROL */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center pt-8 border-t border-black/5 space-x-2">
            <button
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="border border-black/15 hover:border-black px-4 py-2.5 text-[10px] font-mono tracking-widest font-bold text-black disabled:opacity-30 disabled:hover:border-black/15 uppercase transition-all"
            >
              ← PREV PAGE
            </button>
            
            <div className="flex items-center space-x-1.5 px-4 text-xs font-mono text-black/60">
              <span className="font-bold text-black">{currentPage}</span>
              <span>/</span>
              <span>{totalPages}</span>
            </div>

            <button
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="border border-black/15 hover:border-black px-4 py-2.5 text-[10px] font-mono tracking-widest font-bold text-black disabled:opacity-30 disabled:hover:border-black/15 uppercase transition-all"
            >
              NEXT PAGE →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
