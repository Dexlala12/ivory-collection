import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, Check, ArrowRight } from 'lucide-react';
import { CartItem, Product, ActivePage } from '../types';
import { useSiteContent } from '../context/SiteContentContext';
import ProductCard from '../components/ProductCard';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  setActivePage: (page: ActivePage) => void;
  onViewProductDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  discountRate: number;
  setDiscountRate: (rate: number) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
}

export default function CartPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  setActivePage,
  onViewProductDetails,
  onAddToCart,
  discountRate,
  setDiscountRate,
  discountCode,
  setDiscountCode
}: CartPageProps) {
  const { products: PRODUCTS, settings, promoCodes } = useSiteContent();
  const [promoInput, setPromoInput] = useState(discountCode || '');
  const [promoMessage, setPromoMessage] = useState(
    discountRate > 0 ? `✓ ${discountCode} PROMO CODE APPLIED (${Math.round(discountRate * 100)}% OFF)` : ''
  );

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * discountRate;
  const shippingCharge = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingCost;
  const estimatedTax = (subtotal - discountAmount) * settings.taxRate;
  const totalAmount = subtotal - discountAmount + shippingCharge + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const match = promoCodes.find((p) => p.active && p.code.toUpperCase() === promoInput.trim().toUpperCase());
    if (match) {
      setDiscountRate(match.rate);
      setDiscountCode(match.code);
      setPromoMessage(`✓ ${match.code} PROMO CODE APPLIED (${Math.round(match.rate * 100)}% OFF)`);
    } else {
      setPromoMessage('✗ INVALID SYSTEM PROMO CODE');
      setTimeout(() => setPromoMessage(''), 4000);
    }
  };

  // Recommendations: exclude items already in cart
  const cartProductIds = cartItems.map(item => item.product.id);
  const upsellProducts = PRODUCTS.filter(p => !cartProductIds.includes(p.id)).slice(0, 3);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white text-black py-16 sm:py-24 text-center animate-in fade-in duration-300">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <span className="text-5xl">🛍️</span>
          <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase">YOUR BAG IS ENTIRELY EMPTY</h1>
          <p className="text-xs text-black/50 leading-relaxed font-mono uppercase">
            No items have been registered to this terminal. Continue exploring our core technical garments.
          </p>
          <button
            onClick={() => setActivePage('collection')}
            className="w-full bg-black text-[#F4F4F5] hover:bg-black/85 py-4 text-xs font-mono tracking-widest font-bold uppercase transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO RELEASES</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-8 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Cart Header */}
        <div className="border-b border-black/10 pb-6 flex flex-col sm:flex-row justify-between items-baseline gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block">OUTSIDE DESPATCH SYSTEM</span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black uppercase">
              YOUR CART <span className="font-mono text-xl sm:text-2xl text-black/40">({cartItems.length} ITEMS)</span>
            </h1>
          </div>
          <button
            onClick={() => setActivePage('collection')}
            className="text-xs font-mono tracking-widest hover:underline flex items-center space-x-2 text-black/60 hover:text-black uppercase"
          >
            <ArrowLeft size={14} />
            <span>CONTINUE TECHNICAL SHOPPING</span>
          </button>
        </div>

        {/* Cart Grid (Lines + Summary Drawer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Line Item List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 text-[10px] font-mono tracking-widest text-black/40 uppercase pb-3 border-b border-black/5">
              <span className="col-span-6">APPAREL PRODUCT</span>
              <span className="col-span-2 text-center">SIZE / COLOR</span>
              <span className="col-span-2 text-center">QUANTITY</span>
              <span className="col-span-2 text-right">SUBTOTAL</span>
            </div>

            {cartItems.map((item) => (
              <div 
                key={item.id} 
                id={`cart-page-item-${item.id}`}
                className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-6 border-b border-black/5 relative group"
              >
                {/* Image + Title */}
                <div className="col-span-1 sm:col-span-6 flex items-center space-x-4">
                  <div className="w-16 h-20 bg-zinc-50 shrink-0 border border-black/5">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover filter grayscale contrast-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-black/40 uppercase">{item.product.category}</span>
                    <h3 
                      onClick={() => onViewProductDetails(item.product)}
                      className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black hover:underline cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-[10px] font-mono text-black/50">${item.product.price.toFixed(2)} UNIT VALUE</p>
                  </div>
                </div>

                {/* Size / Color */}
                <div className="col-span-1 sm:col-span-2 text-left sm:text-center flex sm:flex-col justify-between sm:justify-center items-center text-xs font-mono text-black/60 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="sm:hidden text-[9px] text-black/40">SIZE/COLOR:</span>
                  <div className="space-y-1 text-right sm:text-center">
                    <div>{item.selectedSize}</div>
                    <div className="flex items-center sm:justify-center space-x-1">
                      <span className="w-2 h-2 inline-block rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor.hex }} />
                      <span className="text-[9px]">{item.selectedColor.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center pt-2 sm:pt-0">
                  <span className="sm:hidden text-[9px] text-black/40 font-mono">QUANTITY:</span>
                  <div className="flex items-center border border-black/15 bg-white">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 px-2.5 text-black hover:bg-black/5 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={10} />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-black">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 px-2.5 text-black hover:bg-black/5 transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-1 sm:col-span-2 text-right flex justify-between sm:justify-end items-center pt-2 sm:pt-0">
                  <span className="sm:hidden text-[9px] text-black/40 font-mono">SUBTOTAL:</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs sm:text-sm font-mono font-bold text-black">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-black/30 hover:text-red-600 p-1 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Right: Order Summary Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-black/10 p-6 sm:p-8 bg-zinc-50 space-y-6">
              <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold border-b border-black/5 pb-3">ORDER SUMMARY</h2>
              
              {/* Cost breakdown */}
              <div className="space-y-3 text-xs font-mono uppercase">
                <div className="flex justify-between text-black/60">
                  <span>CART SUB-VAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>PROMO DISCOUNT (15%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-black/60">
                  <span>SHIPPING DISPATCH</span>
                  <span>{shippingCharge === 0 ? 'COMPLIMENTARY' : `$${shippingCharge.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>ESTIMATED TAX ({Math.round(settings.taxRate * 100)}%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-black/10 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold tracking-widest text-black">TOTAL ESTIMATE</span>
                  <span className="text-lg font-bold font-mono text-black">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Discount Code Input */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER PROMO CODE"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-grow bg-white text-black border border-black/10 focus:border-black px-3 py-2.5 text-[10px] font-mono uppercase tracking-wider rounded-none outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-black/80 text-white px-4 text-[10px] font-mono tracking-widest font-bold uppercase rounded-none"
                  >
                    APPLY
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-[10px] font-mono tracking-wide pt-2 text-zinc-600">
                    {promoMessage}
                  </p>
                )}
              </form>

              {/* Shipping Flat Note */}
              <div className="bg-white border border-black/5 p-4 rounded-none space-y-1.5">
                <span className="text-[9px] font-mono text-black/40 block uppercase">SHIPPING DISPATCH NOTE:</span>
                <p className="text-[10px] text-black/60 leading-relaxed uppercase font-mono">
                  All orders above ${settings.freeShippingThreshold.toFixed(0)} are automatically allocated to our complimentary rapid delivery queue. Typical international dispatch requires 2-5 technical business days.
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-black hover:bg-black/80 text-[#F4F4F5] py-4 text-xs font-mono tracking-widest font-bold uppercase transition-all flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT SECURELY</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* 4. UPSELL CAROUSEL */}
        {upsellProducts.length > 0 && (
          <div className="pt-16 border-t border-black/10 space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-black/40 uppercase block mb-1">SYSTEM RECOMMENDS</span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-wider uppercase">COMPLETE THE GEAR SYSTEM</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {upsellProducts.map((prod) => (
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
