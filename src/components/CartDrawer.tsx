import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onViewCartPage: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onViewCartPage
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 150;
  const remainsForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Dark backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in container */}
      <div 
        id="cart-drawer-container"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-sm sm:text-base font-bold tracking-[0.2em] text-black uppercase">YOUR CART</h2>
            <span className="text-xs font-mono text-black/50">({cartItems.length} ITEMS)</span>
          </div>
          <button 
            onClick={onClose}
            className="text-black hover:opacity-50 p-2 transition-opacity"
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        {cartItems.length > 0 && (
          <div className="px-6 py-3 bg-[#F4F4F5] border-b border-black/5 text-[10px] sm:text-xs tracking-wider">
            {remainsForFreeShipping > 0 ? (
              <p className="text-black/70">
                ADD <span className="font-bold">${remainsForFreeShipping.toFixed(2)}</span> MORE FOR <span className="font-bold">COMPLIMENTARY SHIPPING</span>
              </p>
            ) : (
              <p className="text-black font-bold">★ YOU HAVE QUALIFIED FOR COMPLIMENTARY SHIPPING</p>
            )}
            <div className="w-full bg-black/5 h-1 mt-2 overflow-hidden">
              <div 
                className="bg-black h-full transition-all duration-500" 
                style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Line Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <span className="text-4xl text-black/20">🛒</span>
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-black/50 uppercase">YOUR BAG IS ENTIRELY EMPTY</p>
              <button
                onClick={onClose}
                className="bg-black text-[#F4F4F5] px-6 py-3 text-[10px] font-mono tracking-widest hover:bg-black/80 transition-colors uppercase"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                id={`cart-item-${item.id}`}
                className="flex space-x-4 border-b border-black/5 pb-6"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-[#F4F4F5] flex-shrink-0 relative">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover filter grayscale contrast-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info & controls */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold tracking-wider text-black uppercase line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-black/40 hover:text-black p-1"
                        title="Remove product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="flex flex-wrap text-[10px] font-mono tracking-wide text-black/50 space-x-3">
                      <span>SIZE: {item.selectedSize}</span>
                      <span className="flex items-center space-x-1">
                        <span>COLOR:</span>
                        <span 
                          className="w-2.5 h-2.5 inline-block border border-black/10" 
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-black/10">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-2.5 text-black hover:bg-black/5 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold text-black">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-2.5 text-black hover:bg-black/5 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-mono font-bold text-black">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions and totals */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-black/5 bg-white space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-black/60">
                <span>SHIPPING</span>
                <span>{subtotal >= freeShippingThreshold ? 'FREE' : '$15.00'}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold tracking-widest text-black uppercase">SUBTOTAL</span>
                <span className="text-base sm:text-lg font-mono font-bold text-black">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[9px] font-mono text-black/40 uppercase">Taxes & exact shipping calculated at checkout step.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onViewCartPage();
                  onClose();
                }}
                className="border border-black hover:bg-black/5 text-black py-3 text-[10px] font-mono tracking-widest font-bold transition-all uppercase"
              >
                VIEW CART
              </button>
              <button
                onClick={() => {
                  onCheckout();
                  onClose();
                }}
                className="bg-black hover:bg-black/80 text-[#F4F4F5] py-3 text-[10px] font-mono tracking-widest font-bold transition-all flex items-center justify-center space-x-2 uppercase"
              >
                <span>CHECKOUT</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[9px] font-mono text-black/50 uppercase pt-2">
              <ShieldCheck size={12} className="text-black" />
              <span>LankaPay sandbox payment encryption active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
