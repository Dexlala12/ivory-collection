import React, { useState } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length === 1 || product.sizes[0] === 'One Size') {
      onAddToCart(product, product.sizes[0], product.colors[0]);
      triggerAddedAnimation();
    } else {
      setShowQuickAdd(true);
    }
  };

  const selectQuickSize = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    onAddToCart(product, size, product.colors[0]);
    setShowQuickAdd(false);
    triggerAddedAnimation();
  };

  const triggerAddedAnimation = () => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white text-black border border-black/5 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Stage */}
      <div 
        onClick={() => onViewDetails(product)}
        className="aspect-[3/4] w-full bg-[#F4F4F5] relative overflow-hidden cursor-pointer"
      >
        {/* Grayscale container matching B&W theme. Grayscale fades out on group hover */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105 filter grayscale contrast-110 group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />

        {/* Sold out badge */}
        {!product.inStock && (
          <div className="absolute top-3 left-3 bg-black text-[#F4F4F5] text-[9px] font-mono tracking-widest px-2.5 py-1 uppercase font-bold z-10">
            SOLD OUT
          </div>
        )}

        {/* Quick action overlay triggers */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 space-x-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white hover:bg-black hover:text-white text-black p-3 rounded-none border border-black/10 transition-colors duration-200"
            title="View Technical Specifications"
          >
            <Eye size={16} />
          </button>
          
          {product.inStock && (
            <button
              onClick={handleQuickAddClick}
              className="bg-black hover:bg-white hover:text-black text-white px-4 py-3 rounded-none text-[10px] font-mono tracking-widest flex items-center space-x-2 border border-black transition-colors duration-200"
            >
              {addedAnimation ? (
                <>
                  <Check size={12} className="text-green-500" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={12} />
                  <span>QUICK ADD</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Quick Add Size Panel overlay (Slides up inside image box) */}
        {showQuickAdd && (
          <div 
            className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-4 border-t border-black/10 z-20 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-mono tracking-widest text-black/50">SELECT SIZE</span>
              <button 
                onClick={() => setShowQuickAdd(false)}
                className="text-black hover:opacity-50 text-[10px]"
              >
                CLOSE
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => selectQuickSize(e, size)}
                  className="border border-black/20 hover:border-black py-2 text-center text-[10px] font-bold tracking-wider hover:bg-black hover:text-white transition-all duration-150 uppercase"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Card Info Section */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="cursor-pointer" onClick={() => onViewDetails(product)}>
          <span className="text-[9px] font-mono tracking-[0.15em] text-black/40 uppercase block mb-1">
            {product.category}
          </span>
          <h3 className="text-xs sm:text-sm font-bold tracking-[0.1em] text-black uppercase line-clamp-1 group-hover:underline">
            {product.name}
          </h3>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-2">
          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-black">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono tracking-wider text-black/50 flex items-center">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
