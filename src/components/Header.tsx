import { useState } from 'react';
import { Search, ShoppingBag, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { ActivePage, StaticPageType } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  setActiveCategory: (catId: string) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  setStaticPageType: (type: StaticPageType) => void;
}

export default function Header({
  activePage,
  setActivePage,
  setActiveCategory,
  cartItemsCount,
  onOpenCart,
  onOpenSearch,
  setStaticPageType
}: HeaderProps) {
  const { categoriesWithAll: CATEGORIES, header } = useSiteContent();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setActivePage('collection');
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleStaticClick = (pageType: StaticPageType) => {
    setStaticPageType(pageType);
    setActivePage('static');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top micro announcement strip */}
      <div className="bg-black text-[#F4F4F5] py-2 px-4 text-center text-[10px] tracking-[0.2em] font-mono border-b border-[#27272A] z-50 relative uppercase">
        {header.announcement}
      </div>

      {/* Sticky Header Container */}
      <header id="app-header" className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-black/5 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black p-2 hover:opacity-60 transition-opacity"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Left: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-[0.2em]">
            <button
              id="nav-home-btn"
              onClick={() => {
                setActivePage('home');
                setIsMegaMenuOpen(false);
              }}
              className={`hover:opacity-100 transition-opacity uppercase pb-1 border-b ${
                activePage === 'home' ? 'border-black opacity-100' : 'border-transparent opacity-60'
              }`}
            >
              {header.navLabels.home}
            </button>

            {/* Shop with Chevron triggering Mega-Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                id="nav-shop-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setActivePage('collection');
                }}
                className={`flex items-center space-x-1 hover:opacity-100 transition-opacity uppercase pb-1 border-b ${
                  activePage === 'collection' ? 'border-black opacity-100' : 'border-transparent opacity-60'
                }`}
              >
                <span>{header.navLabels.shop}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega-Menu Dropdown */}
              {isMegaMenuOpen && (
                <div 
                  id="mega-menu"
                  className="absolute left-0 top-[22px] w-[500px] bg-white border border-black/10 shadow-2xl p-6 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div>
                    <h3 className="text-[10px] font-mono tracking-[0.2em] text-black/40 mb-4 uppercase">CATEGORIES</h3>
                    <div className="flex flex-col space-y-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="text-left text-xs font-semibold tracking-wider hover:pl-2 hover:opacity-100 opacity-70 transition-all duration-200 uppercase"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black text-[#F4F4F5] p-5 flex flex-col justify-between relative overflow-hidden group">
                    <img
                      src={header.megaMenu.image}
                      alt="Mega menu feature"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10">
                      <span className="text-[9px] font-mono tracking-widest text-[#A1A1AA] uppercase">{header.megaMenu.tag}</span>
                      <h4 className="text-sm font-bold tracking-wider mt-1 text-white uppercase">{header.megaMenu.heading}</h4>
                    </div>
                    <button 
                      onClick={() => handleCategoryClick('all')}
                      className="relative z-10 flex items-center space-x-2 text-[10px] tracking-widest font-bold mt-8 text-white hover:underline uppercase text-left"
                    >
                      <span>EXPLORE SERIES</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-about-btn"
              onClick={() => handleStaticClick('about')}
              className={`hover:opacity-100 transition-opacity uppercase pb-1 border-b ${
                activePage === 'static' ? 'opacity-100' : 'border-transparent opacity-60'
              }`}
            >
              {header.navLabels.concept}
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => handleStaticClick('contact')}
              className="hover:opacity-100 transition-opacity uppercase pb-1 border-b border-transparent opacity-60"
            >
              {header.navLabels.contact}
            </button>
          </nav>

          {/* Center: Brand Logo */}
          <div className="text-center">
            <button
              id="nav-logo-btn"
              onClick={() => setActivePage('home')}
              className="text-lg sm:text-2xl font-black tracking-[0.3em] font-sans text-black hover:opacity-80 transition-opacity"
            >
              IVORY
            </button>
          </div>

          {/* Right: Search, Cart Icon + Badge */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Trigger */}
            <button
              id="search-trigger-btn"
              onClick={onOpenSearch}
              className="text-black p-2 hover:opacity-60 transition-opacity"
              aria-label="Open search"
            >
              <Search size={18} />
            </button>

            {/* Cart Icon + Badge */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="relative text-black p-2 hover:opacity-60 transition-opacity flex items-center"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              {cartItemsCount > 0 && (
                <span 
                  id="cart-count-badge"
                  className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-mono font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce"
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-nav-panel"
            className="md:hidden bg-white border-b border-black/10 py-4 px-6 space-y-4 animate-in slide-in-from-top-4 duration-200"
          >
            <div className="flex flex-col space-y-3 text-xs tracking-[0.15em] font-medium">
              <button
                onClick={() => {
                  setActivePage('home');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:opacity-60 uppercase"
              >
                HOME
              </button>
              <hr className="border-black/5" />
              <div className="flex flex-col space-y-2 pl-2">
                <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase">COLLECTIONS</span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-left py-1 hover:opacity-60 uppercase pl-1 text-[11px]"
                  >
                    — {cat.name}
                  </button>
                ))}
              </div>
              <hr className="border-black/5" />
              <button
                onClick={() => handleStaticClick('about')}
                className="text-left py-2 hover:opacity-60 uppercase"
              >
                THE CONCEPT
              </button>
              <button
                onClick={() => handleStaticClick('contact')}
                className="text-left py-2 hover:opacity-60 uppercase"
              >
                CONNECT & LOCATIONS
              </button>
              <button
                onClick={() => handleStaticClick('faq')}
                className="text-left py-2 hover:opacity-60 uppercase"
              >
                SUPPORT / FAQS
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
