import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ShoppingBag, ShieldAlert, Check, HelpCircle } from 'lucide-react';
import { Product, ActivePage } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import ProductCard from '../components/ProductCard';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onBack: () => void;
  setActivePage: (page: ActivePage) => void;
  onViewProductDetails: (product: Product) => void;
}

export default function ProductDetail({
  product,
  onAddToCart,
  onBack,
  setActivePage,
  onViewProductDetails
}: ProductDetailProps) {
  const { products: PRODUCTS } = useSiteContent();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Matte Obsidian Black', hex: '#111111' });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs' | 'care'>('highlights');
  const [isAdded, setIsAdded] = useState(false);

  // Sync state if product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0] || { name: 'Matte Obsidian Black', hex: '#111111' });
    setQuantity(1);
    setActiveTab('highlights');
  }, [product]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Filter cross-sell recommendations
  const relatedProducts = PRODUCTS.filter(
    p => p.id !== product.id && (p.category === product.category || p.activities.some(a => product.activities.includes(a)))
  ).slice(0, 3);

  return (
    <div className="bg-white text-black py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-black/60 hover:text-black hover:underline uppercase"
        >
          <ArrowLeft size={14} />
          <span>RETURN TO APPAREL CATALOGUE</span>
        </button>

        {/* Product Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Interactive Image Gallery (5 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-20 bg-zinc-50 border transition-all ${
                      activeImage === img ? 'border-black opacity-100 scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} alternate view ${i+1}`} 
                      className="w-full h-full object-cover filter grayscale contrast-110"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Stage Showcase */}
            <div className="flex-grow aspect-[3/4] bg-[#F4F4F5] overflow-hidden relative border border-black/5">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover filter grayscale contrast-105 hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {!product.inStock && (
                <div className="absolute top-4 left-4 bg-black text-[#F4F4F5] text-[10px] font-mono tracking-widest px-3 py-1.5 font-bold uppercase">
                  UNAVAILABLE / SOLD OUT
                </div>
              )}
            </div>
          </div>

          {/* Right: Technical Specs & Add to cart configuration (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              {/* Category, Title, Price */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block">{product.category}</span>
                <h1 className="text-xl sm:text-3xl font-black tracking-tight text-black uppercase">{product.name}</h1>
                <p className="text-lg sm:text-xl font-mono font-bold tracking-wider text-black pt-1">${product.price.toFixed(2)}</p>
              </div>

              {/* Rating and short stats */}
              <div className="flex items-center space-x-4 text-xs font-mono text-black/50 border-y border-black/5 py-2.5">
                <span>RATING: ★ {product.rating.toFixed(1)}</span>
                <span>•</span>
                <span>STATUS: {product.inStock ? 'ACTIVE ALLOCATED' : 'OUT OF STOCK'}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-black/70 leading-relaxed font-sans">{product.description}</p>

              {/* COLOR SWATCHES */}
              {product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono tracking-widest text-black/50 block uppercase">
                    COLORWAY: <span className="font-bold text-black">{selectedColor.name}</span>
                  </span>
                  <div className="flex space-x-2.5">
                    {product.colors.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`w-7 h-7 rounded-none border flex items-center justify-center transition-all ${
                          selectedColor.name === col.name 
                            ? 'border-black ring-1 ring-black scale-105' 
                            : 'border-black/20 hover:border-black/40'
                        }`}
                        title={col.name}
                      >
                        <span 
                          className="w-5 h-5 inline-block border border-black/5" 
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SIZE SELECTION */}
              {product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-mono tracking-widest text-black/50 uppercase block">
                      SIZE MATRIX: <span className="font-bold text-black">{selectedSize}</span>
                    </span>
                    <button 
                      onClick={() => setActivePage('static')}
                      className="text-[9px] font-mono text-black/40 hover:text-black hover:underline uppercase"
                    >
                      Size Specifications
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 text-center text-xs font-mono font-bold uppercase transition-all border ${
                          selectedSize === sz 
                            ? 'border-black bg-black text-[#F4F4F5]' 
                            : 'border-black/15 hover:border-black text-black bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stepper, Add button */}
            <div className="space-y-4 pt-4 border-t border-black/10">
              {product.inStock ? (
                <>
                  <div className="flex space-x-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-black/15 bg-white shrink-0">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                        className="p-3 text-black hover:bg-black/5 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-4 text-sm font-mono font-bold text-black min-w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="p-3 text-black hover:bg-black/5 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={handleAdd}
                      className="flex-grow bg-black hover:bg-black/85 text-[#F4F4F5] py-4.5 px-6 text-xs font-mono tracking-widest font-bold uppercase transition-all flex items-center justify-center space-x-2"
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} className="text-green-500" />
                          <span>DISPATCHED TO CART Drawer</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>ADD INTEGRATION TO CART</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-zinc-100 p-4 border border-black/5 flex items-start space-x-3 text-xs text-black/60 leading-relaxed uppercase font-mono">
                  <ShieldAlert size={16} className="text-black shrink-0 mt-0.5" />
                  <p>
                    This item is currently out of stock. Contact our technical center to register for next batch allocation warnings.
                  </p>
                </div>
              )}
            </div>

            {/* Technical Spec Accordeon block */}
            <div className="border border-black/10">
              <div className="flex border-b border-black/10 text-[9px] font-mono tracking-wider font-bold uppercase bg-zinc-50">
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`flex-1 py-3 text-center border-r border-black/10 ${activeTab === 'highlights' ? 'bg-white text-black border-b-2 border-b-black' : 'text-black/50 hover:text-black'}`}
                >
                  HIGHLIGHTS
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-3 text-center border-r border-black/10 ${activeTab === 'specs' ? 'bg-white text-black border-b-2 border-b-black' : 'text-black/50 hover:text-black'}`}
                >
                  FIBERS
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`flex-1 py-3 text-center ${activeTab === 'care' ? 'bg-white text-black border-b-2 border-b-black' : 'text-black/50 hover:text-black'}`}
                >
                  MAINTENANCE
                </button>
              </div>
              <div className="p-4 text-xs font-sans text-black/75 leading-relaxed bg-white min-h-24">
                {activeTab === 'highlights' && (
                  <ul className="list-disc pl-4 space-y-1 text-black/70">
                    {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
                {activeTab === 'specs' && (
                  <div className="space-y-2">
                    <p><span className="font-mono font-bold block text-[10px] text-black">MATERIAL COMPOST:</span> {product.specs.material}</p>
                    <p><span className="font-mono font-bold block text-[10px] text-black">FIT PROFILE:</span> {product.specs.fit}</p>
                  </div>
                )}
                {activeTab === 'care' && (
                  <p className="italic text-black/60 text-[11px] font-mono">{product.specs.care}</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS / RECOMMENDATIONS ROW */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-black/10 space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block mb-1">SYSTEM CO-SELECTIONS</span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase text-black">COMPLETE THE LOOK</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onViewDetails={onViewProductDetails}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
