import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Volume2, Shield } from 'lucide-react';
import { Product, ActivePage, PromoTile } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  setActivePage: (page: ActivePage) => void;
  setActiveCategory: (catId: string) => void;
  setActiveActivity: (actId: string) => void;
  onViewProductDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function Home({
  setActivePage,
  setActiveCategory,
  setActiveActivity,
  onViewProductDetails,
  onAddToCart
}: HomeProps) {
  const { products: PRODUCTS, promoTiles: PROMO_TILES, categories: CATEGORIES, activities: ACTIVITIES, homeHero } = useSiteContent();
  const [activeActivityTab, setActiveActivityTab] = useState('running');
  const carousel1Ref = useRef<HTMLDivElement>(null);
  const carousel2Ref = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 340; // width + gap
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Filtered lists for feeds
  const primaryFeed = PRODUCTS.filter(p => p.inStock).slice(0, 5);
  const secondaryFeed = PRODUCTS.filter(p => p.category === 'tops' || p.category === 'outerwear').slice(0, 5);
  
  // Filter for Shop by Activity sets
  const activityProducts = PRODUCTS.filter(p => p.activities.includes(activeActivityTab)).slice(0, 4);

  const handlePromoClick = (promo: PromoTile) => {
    if (promo.type === 'category') {
      setActiveCategory(promo.link);
      setActivePage('collection');
    } else {
      setActiveActivity(promo.link);
      setActivePage('collection');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryGridClick = (catId: string) => {
    setActiveCategory(catId);
    setActivePage('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 bg-white text-black animate-in fade-in duration-300">
      
      {/* 1. HERO SECTION WITH VIDEO BACKDROP/IMAGE & DUAL CTAS */}
      <section id="homepage-hero" className="relative h-[80vh] sm:h-[90vh] bg-[#111111] overflow-hidden flex items-center">
        {/* Full screen atmospheric visual */}
        <div className="absolute inset-0 z-0">
          {/* We use an ultra premium loopable MP4 vector style or a gorgeous cinematic activewear photo.
              Let's also make sure we show a premium dark photography overlay. */}
          <img 
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop" 
            alt="Cinematic activewear training session" 
            className="w-full h-full object-cover opacity-40 filter grayscale contrast-125 scale-100 animate-pulse duration-[10000ms]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        </div>

        {/* Overlay text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-[#A1A1AA] uppercase block">
              {homeHero.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-[-0.03em] uppercase leading-none max-w-4xl">
              {homeHero.heading.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}{i < arr.length - 1 && <br className="hidden sm:block" />}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-xs sm:text-sm text-[#D4D4D8] tracking-wider font-sans max-w-lg leading-relaxed pt-2">
              {homeHero.subheading}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => {
                setActiveCategory('all');
                setActivePage('collection');
              }}
              className="bg-white hover:bg-[#E4E4E7] text-black px-8 py-4 text-xs font-mono tracking-widest font-bold transition-colors uppercase rounded-none"
            >
              {homeHero.primaryCtaLabel}
            </button>
            <button
              onClick={() => {
                setActiveActivity('streetwear');
                setActivePage('collection');
              }}
              className="border border-white/30 hover:border-white bg-black/20 backdrop-blur-sm text-white px-8 py-4 text-xs font-mono tracking-widest font-bold transition-colors uppercase rounded-none"
            >
              {homeHero.secondaryCtaLabel}
            </button>
          </div>
        </div>
      </section>

      {/* 2. PROMO TILES (2-UP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROMO_TILES.map((tile, i) => (
            <div
              key={tile.id}
              onClick={() => handlePromoClick(tile)}
              className="group relative aspect-[16/10] sm:aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer flex items-end p-6 sm:p-10 border border-black/5"
            >
              <img 
                src={tile.image} 
                alt={tile.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
              
              <div className="relative z-10 space-y-2 text-white">
                <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">SERIES 0{i + 1}</span>
                <h3 className="text-lg sm:text-xl font-bold tracking-wider uppercase group-hover:underline">{tile.title}</h3>
                <p className="text-[11px] text-[#A1A1AA] font-sans max-w-sm line-clamp-2 leading-relaxed">{tile.subtitle}</p>
                <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest uppercase">
                  <span>DISCOVER</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT CAROUSEL (PRIMARY FEED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase">ACTIVE DISPATCHES</span>
            <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase">AVAILABLE APPAREL</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => scrollCarousel(carousel1Ref, 'left')}
              className="border border-black/15 hover:border-black p-2 bg-white text-black transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollCarousel(carousel1Ref, 'right')}
              className="border border-black/15 hover:border-black p-2 bg-white text-black transition-colors"
              aria-label="Next products"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div 
          ref={carousel1Ref}
          className="flex space-x-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
        >
          {primaryFeed.map((prod) => (
            <div key={prod.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
              <ProductCard 
                product={prod} 
                onViewDetails={onViewProductDetails} 
                onAddToCart={onAddToCart} 
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. STATIC MID BANNER */}
      <section className="relative h-[40vh] sm:h-[50vh] bg-zinc-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1920&auto=format&fit=crop" 
          alt="Technical fibers close up detail" 
          className="w-full h-full object-cover opacity-50 filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white space-y-2">
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#A1A1AA] uppercase">LABORATORY EXPERIMENT AT LEVEL 01</span>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-widest uppercase">THE ZERO-FRICTION CORE MATRIX</h2>
            <p className="text-xs text-[#D4D4D8] font-mono uppercase max-w-md">Knitted circular weave engineered to disperse moisture and map kinetic temperature grids.</p>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block mb-1">SYSTEM CLASSIFICATIONS</span>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase">SHOP BY CATEGORY</h2>
        </div>
        
        {/* Row of category tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat, i) => {
            // Find a representing image in products
            const representingProduct = PRODUCTS.find(p => p.category === cat.id);
            const representImage = representingProduct ? representingProduct.images[0] : 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop';
            
            return (
              <div 
                key={cat.id}
                onClick={() => handleCategoryGridClick(cat.id)}
                className="group relative aspect-[3/4] bg-zinc-100 border border-black/5 overflow-hidden cursor-pointer flex items-end p-4"
              >
                <img 
                  src={representImage} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="relative z-10 w-full text-white flex justify-between items-center">
                  <span className="text-xs font-bold tracking-wider uppercase">{cat.name}</span>
                  <span className="text-[9px] font-mono text-zinc-400 group-hover:translate-x-1 transition-transform">0{i+1} →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SINGLE-CATEGORY PUSH BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-zinc-900 text-white grid grid-cols-1 md:grid-cols-12 overflow-hidden border border-black/5">
          <div className="md:col-span-7 relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop" 
              alt="Model runners" 
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-115"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="md:col-span-5 p-8 sm:p-12 md:p-16 flex flex-col justify-center space-y-6">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#A1A1AA] uppercase">PERFORMANCE SUITE</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-tight">
              HIGH STIMULUS RUNNING COMPACTS
            </h2>
            <p className="text-xs text-[#D4D4D8] leading-relaxed">
              Explore high-wicking base layouts designed and compiled exclusively for velocity. Reduced panel seams and silver yarn mapping.
            </p>
            <button
              onClick={() => {
                setActiveActivity('running');
                setActivePage('collection');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white hover:bg-[#E4E4E7] text-black py-4.5 px-6 text-[10px] font-mono tracking-widest font-bold uppercase transition-colors text-center w-full sm:w-auto"
            >
              EXPLORE RUNNING SERIES
            </button>
          </div>
        </div>
      </section>

      {/* 7. SHOP BY ACTIVITY (TABS & CORE FEED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block">KINETIC CLASSIFICATION</span>
          <h2 className="text-lg sm:text-3xl font-bold tracking-tight uppercase">SHOP BY SYSTEM ENVIRONMENT</h2>
        </div>

        {/* Tab switchers */}
        <div className="flex justify-center border-b border-black/10">
          <div className="flex space-x-8">
            {ACTIVITIES.map((act) => (
              <button
                key={act.id}
                onClick={() => setActiveActivityTab(act.id)}
                className={`py-3 text-xs font-bold tracking-widest transition-all border-b-2 uppercase ${
                  activeActivityTab === act.id 
                    ? 'border-black text-black' 
                    : 'border-transparent text-black/40 hover:text-black/70'
                }`}
              >
                {act.name}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {activityProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onViewDetails={onViewProductDetails} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      </section>

      {/* 8. SECONDARY VIDEO BANNER */}
      <section className="relative h-[40vh] sm:h-[50vh] bg-zinc-950 overflow-hidden">
        {/* We reuse the static atmospheric B&W streetwear lifestyle capture here */}
        <img 
          src="https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1920&auto=format&fit=crop" 
          alt="Atmospheric training session" 
          className="w-full h-full object-cover opacity-30 filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="space-y-3 px-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#A1A1AA] uppercase">IVORY CORE ESSENCE</span>
            <h2 className="text-lg sm:text-2xl font-bold tracking-widest uppercase">THE INTENSITY EXPERIMENTAL STAGE</h2>
            <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-zinc-500">
              <Shield size={12} />
              <span>TESTED UNDER HIGHEST METRIC STRESS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRIPLE CTA ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative aspect-[4/5] bg-zinc-100 border border-black/5 overflow-hidden flex flex-col justify-end p-6">
            <img 
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop" 
              alt="Oversized series" 
              className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-3 text-white">
              <h3 className="text-sm font-bold tracking-wider uppercase">TOPS & SWEATSHIRTS</h3>
              <button 
                onClick={() => { setActiveCategory('tops'); setActivePage('collection'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-white text-black py-2.5 px-4 text-[9px] font-mono tracking-widest font-bold uppercase hover:bg-zinc-200 transition-colors block w-full text-center"
              >
                DISCOVER SERIES
              </button>
            </div>
          </div>

          <div className="group relative aspect-[4/5] bg-zinc-100 border border-black/5 overflow-hidden flex flex-col justify-end p-6">
            <img 
              src="https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?q=80&w=600&auto=format&fit=crop" 
              alt="Axis track series" 
              className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-3 text-white">
              <h3 className="text-sm font-bold tracking-wider uppercase">UTILITY TROUSERS</h3>
              <button 
                onClick={() => { setActiveCategory('bottoms'); setActivePage('collection'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-white text-black py-2.5 px-4 text-[9px] font-mono tracking-widest font-bold uppercase hover:bg-zinc-200 transition-colors block w-full text-center"
              >
                DISCOVER SERIES
              </button>
            </div>
          </div>

          <div className="group relative aspect-[4/5] bg-zinc-100 border border-black/5 overflow-hidden flex flex-col justify-end p-6">
            <img 
              src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop" 
              alt="Orbit footwear series" 
              className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-3 text-white">
              <h3 className="text-sm font-bold tracking-wider uppercase">FOOTWEAR LAB</h3>
              <button 
                onClick={() => { setActiveCategory('footwear'); setActivePage('collection'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-white text-black py-2.5 px-4 text-[9px] font-mono tracking-widest font-bold uppercase hover:bg-zinc-200 transition-colors block w-full text-center"
              >
                DISCOVER SERIES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECONDARY PRODUCT CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
        <div className="flex justify-between items-baseline border-b border-black/10 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase">LAYERING ESSENTIALS</span>
            <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase">TOPS & COATS COHORT</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => scrollCarousel(carousel2Ref, 'left')}
              className="border border-black/15 hover:border-black p-2 bg-white text-black transition-colors"
              aria-label="Previous outerwear"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollCarousel(carousel2Ref, 'right')}
              className="border border-black/15 hover:border-black p-2 bg-white text-black transition-colors"
              aria-label="Next outerwear"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div 
          ref={carousel2Ref}
          className="flex space-x-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
        >
          {secondaryFeed.map((prod) => (
            <div key={prod.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
              <ProductCard 
                product={prod} 
                onViewDetails={onViewProductDetails} 
                onAddToCart={onAddToCart} 
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
