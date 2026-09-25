import React, { useState, useEffect } from 'react';
import { Search, X, Shield, Landmark, HelpCircle, ShoppingBag } from 'lucide-react';
import { ActivePage, CartItem, Product, StaticPageType } from './types';
import { useSiteContent } from './context/SiteContentContext';

// Component Imports
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Page Imports
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import StaticPages from './pages/StaticPages';
import SearchPage from './pages/SearchPage';

export default function App() {
  const { products } = useSiteContent();

  // Navigation & Page State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeActivity, setActiveActivity] = useState<string>('all');
  const [staticPageType, setStaticPageType] = useState<StaticPageType>('about');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart Local Storage Persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('ivory_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Promo code persistence
  const [discountRate, setDiscountRate] = useState<number>(() => {
    const stored = localStorage.getItem('ivory_discount_rate');
    return stored ? Number(stored) : 0;
  });
  const [discountCode, setDiscountCode] = useState<string>(() => {
    return localStorage.getItem('ivory_discount_code') || '';
  });

  // Modal / Overlay States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickSearchTerm, setQuickSearchTerm] = useState('');

  // Sync cart details with local storage
  useEffect(() => {
    localStorage.setItem('ivory_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ivory_discount_rate', discountRate.toString());
    localStorage.setItem('ivory_discount_code', discountCode);
  }, [discountRate, discountCode]);

  // Handler: Add to Cart
  const handleAddToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    setCartItems((prevItems) => {
      // Find matching item with same product ID, size, and color
      const existingIndex = prevItems.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        // Increment quantity
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // Create new item
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color.name.replace(/\s+/g, '')}`,
          product,
          quantity: 1,
          selectedSize: size,
          selectedColor: color
        };
        return [...prevItems, newItem];
      }
    });

    // Automatically trigger slide-in cart drawer for positive feedback
    setIsCartOpen(true);
  };

  // Handler: Update Quantity
  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) => 
      prev.map((item) => item.id === id ? { ...item, quantity: qty } : item)
    );
  };

  // Handler: Remove Item
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler: Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handler: View details page of clicked product
  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchTerm.trim()) {
      setSearchQuery(quickSearchTerm);
      setActivePage('search');
      setIsSearchOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickSearchSuggestion = (term: string) => {
    setQuickSearchTerm(term);
    setSearchQuery(term);
    setActivePage('search');
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans antialiased selection:bg-black selection:text-white">
      
      {/* 1. Shared Sticky Navigation Header */}
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page === 'collection') {
            setActiveCategory('all');
            setActiveActivity('all');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setActiveCategory={(catId) => {
          setActiveCategory(catId);
          setActiveActivity('all');
        }}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        setStaticPageType={setStaticPageType}
      />

      {/* 2. Main Content Stage with Route Views */}
      <main id="app-main-content" className="flex-grow">
        {activePage === 'home' && (
          <Home
            setActivePage={setActivePage}
            setActiveCategory={setActiveCategory}
            setActiveActivity={setActiveActivity}
            onViewProductDetails={handleViewProductDetails}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'collection' && (
          <Collection
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeActivity={activeActivity}
            setActiveActivity={setActiveActivity}
            onViewProductDetails={handleViewProductDetails}
            onAddToCart={handleAddToCart}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'product' && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => {
              setActivePage('collection');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActivePage={setActivePage}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => {
              setActivePage('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setActivePage={setActivePage}
            onViewProductDetails={handleViewProductDetails}
            onAddToCart={handleAddToCart}
            discountRate={discountRate}
            setDiscountRate={setDiscountRate}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
          />
        )}

        {activePage === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            discountRate={discountRate}
            setDiscountRate={setDiscountRate}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            onClearCart={handleClearCart}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'static' && (
          <StaticPages
            pageType={staticPageType}
            setPageType={setStaticPageType}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'search' && (
          <SearchPage
            initialQuery={searchQuery}
            onViewProductDetails={handleViewProductDetails}
            onAddToCart={handleAddToCart}
            setActivePage={setActivePage}
            setActiveCategory={setActiveCategory}
          />
        )}
      </main>

      {/* 3. Shared Footer */}
      <Footer
        setActivePage={(page) => {
          setActivePage(page);
          if (page === 'collection') {
            setActiveCategory('all');
            setActiveActivity('all');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        setStaticPageType={setStaticPageType}
      />

      {/* 4. Side AJAX Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setActivePage('checkout');
          setIsCartOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewCartPage={() => {
          setActivePage('cart');
          setIsCartOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Fullscreen Search Trigger Drawer Overlay */}
      {isSearchOpen && (
        <div id="fullscreen-search-overlay" className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-200">
          
          {/* Upper control header */}
          <div className="max-w-7xl mx-auto w-full flex justify-end">
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setQuickSearchTerm('');
              }}
              className="text-black hover:opacity-50 p-3 flex items-center space-x-2 text-xs font-mono tracking-widest uppercase font-bold"
            >
              <span>ESC / CLOSE</span>
              <X size={16} />
            </button>
          </div>

          {/* Central search searchbox */}
          <div className="max-w-3xl mx-auto w-full space-y-8 py-12">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block">CORE DATABASE SEARCH</span>
              <h2 className="text-2xl font-black uppercase tracking-tight">SCOUR THE IVORY SYSTEM</h2>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative flex border-b-2 border-black pb-4">
              <input
                type="text"
                autoFocus
                placeholder="TYPE KEYWORDS (e.g. PARKA, COMPRESSION, RUNNER)..."
                value={quickSearchTerm}
                onChange={(e) => setQuickSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-3xl font-bold uppercase tracking-wide outline-none placeholder:text-zinc-300"
              />
              <button type="submit" className="text-black hover:opacity-60 p-2" aria-label="Submit search query">
                <Search size={28} />
              </button>
            </form>

            {/* Popular quick searches suggestion buttons */}
            <div className="space-y-3 uppercase text-xs">
              <span className="text-[10px] font-mono tracking-widest text-black/40 block">POPULAR SUGGESTED VECTORS:</span>
              <div className="flex flex-wrap gap-2.5">
                {['NERO UTILITY', 'COMPRESSION', 'TRAIN PANTS', 'ORBIT SNEAKER', 'DUFFEL'].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleQuickSearchSuggestion(sug)}
                    className="border border-black/15 hover:border-black bg-white py-2 px-4 text-[10px] font-mono tracking-wider transition-all uppercase"
                  >
                    {sug} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom decorative coordinates */}
          <div className="max-w-7xl mx-auto w-full text-center text-[9px] font-mono text-black/30 uppercase tracking-widest">
            SYSTEM DISPATCH TERMINAL • ONLINE ENCRYPTED PORT
          </div>

        </div>
      )}

    </div>
  );
}
