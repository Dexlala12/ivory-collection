import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, Landmark, Check, HelpCircle, Loader2, MessageCircle } from 'lucide-react';
import { CartItem, Product, ActivePage, Order } from '../types';
// LankaPay gateway is disabled for now (see payment step below) — re-enable for the production launch.
import LankaPayModal from '../components/LankaPayModal';
import { useSiteContent } from '../context/SiteContentContext';
import { insertOrder } from '../lib/api';

interface CheckoutProps {
  cartItems: CartItem[];
  discountRate: number;
  setDiscountRate: (rate: number) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  onClearCart: () => void;
  setActivePage: (page: ActivePage) => void;
}

export default function Checkout({
  cartItems,
  discountRate,
  setDiscountRate,
  discountCode,
  setDiscountCode,
  onClearCart,
  setActivePage
}: CheckoutProps) {
  const { settings, promoCodes } = useSiteContent();

  // Checkout flow step: 'information' | 'shipping' | 'payment' | 'success'
  const [currentStep, setCurrentStep] = useState<'information' | 'shipping' | 'payment' | 'success'>('information');
  const [isLankaPayOpen, setIsLankaPayOpen] = useState(false);
  const [isPlacingStandardOrder, setIsPlacingStandardOrder] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  // 'card' and 'lankapay' are disabled for now — only 'whatsapp' (bank transfer inquiry) is active. See payment step render below.
  const [paymentOption, setPaymentOption] = useState<'card' | 'lankapay' | 'whatsapp'>('whatsapp');

  // Credit card details (standard)
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvc, setCcCvc] = useState('');

  // Discount code
  const [promoInput, setPromoInput] = useState(discountCode || '');
  const [promoMsg, setPromoMsg] = useState('');

  // Generated completed order details
  const [finalOrder, setFinalOrder] = useState<Order | null>(null);

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * discountRate;
  const standardShipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingCost;
  const shippingCharge = shippingMethod === 'express' ? settings.expressShippingCost : standardShipping;
  const estimatedTax = (subtotal - discountAmount) * settings.taxRate;
  const totalAmount = subtotal - discountAmount + shippingCharge + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const match = promoCodes.find((p) => p.active && p.code.toUpperCase() === promoInput.trim().toUpperCase());
    if (match) {
      setDiscountRate(match.rate);
      setDiscountCode(match.code);
      setPromoMsg(`✓ ${Math.round(match.rate * 100)}% OFF APPLIED`);
    } else {
      setPromoMsg('✗ INVALID CODE');
      setTimeout(() => setPromoMsg(''), 3000);
    }
  };

  const handleInformationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName && lastName && address && city && postalCode) {
      setCurrentStep('shipping');
    } else {
      alert('Please fill out all required contact and address details.');
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const executeOrderPlacement = (
    paymentDetails: { gateway: string; transactionId: string },
    paymentStatus: Order['paymentStatus'] = 'success'
  ) => {
    const createdOrder: Order = {
      id: `NM-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cartItems],
      subtotal,
      shipping: shippingCharge,
      tax: estimatedTax,
      total: totalAmount,
      customerInfo: {
        email,
        firstName,
        lastName,
        address,
        apartment,
        city,
        postalCode,
        country,
        phone,
        shippingMethod: shippingMethod.toUpperCase()
      },
      paymentMethod: paymentDetails.gateway,
      paymentStatus,
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    setFinalOrder(createdOrder);
    setCurrentStep('success');
    onClearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Builds the order recap text sent to the store's WhatsApp number for manual bank-transfer confirmation.
  const buildWhatsAppInquiryMessage = () => {
    const itemLines = cartItems
      .map((item) => `- ${item.product.name} | ${item.selectedColor.name} | Size ${item.selectedSize} x${item.quantity} — $${(item.product.price * item.quantity).toFixed(2)}`)
      .join('\n');

    return [
      '*NEW ORDER INQUIRY — IVORY*',
      '',
      `*Customer:* ${firstName} ${lastName}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      `*Delivery Address:* ${address}${apartment ? ', ' + apartment : ''}, ${city}, ${postalCode}, ${country}`,
      `*Shipping Method:* ${shippingMethod === 'express' ? `Rapid Core Priority ($${settings.expressShippingCost.toFixed(2)})` : `Standard Secured (${subtotal >= settings.freeShippingThreshold ? 'Free' : `$${settings.standardShippingCost.toFixed(2)}`})`}`,
      '',
      '*Items:*',
      itemLines,
      '',
      `*Subtotal:* $${subtotal.toFixed(2)}`,
      discountRate > 0 ? `*Discount (${discountCode}):* -$${discountAmount.toFixed(2)}` : null,
      `*Shipping:* ${shippingCharge === 0 ? 'FREE' : `$${shippingCharge.toFixed(2)}`}`,
      `*Estimated Tax:* $${estimatedTax.toFixed(2)}`,
      `*Total:* $${totalAmount.toFixed(2)}`,
      '',
      'Please confirm availability and send bank transfer instructions.'
    ].filter((line): line is string => line !== null).join('\n');
  };

  // Opens WhatsApp with a prefilled inquiry instead of taking a real payment.
  const sendWhatsAppInquiry = () => {
    const message = buildWhatsAppInquiryMessage();
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    const paymentDetails = { gateway: 'Bank Transfer (WhatsApp Inquiry)', transactionId: `INQ-${Math.floor(10000000 + Math.random() * 90000000)}` };
    executeOrderPlacement(paymentDetails, 'pending');

    // Persist the inquiry to the database (visible in the admin portal's Orders screen). Best-effort:
    // opening WhatsApp above is the part the customer needs, so a failed save shouldn't block checkout.
    insertOrder({
      orderNumber: paymentDetails.transactionId,
      items: cartItems,
      customerInfo: { email, phone, firstName, lastName, address, apartment, city, postalCode, country, shippingMethod: shippingMethod.toUpperCase() },
      subtotal,
      shipping: shippingCharge,
      tax: estimatedTax,
      total: totalAmount,
      paymentMethod: paymentDetails.gateway,
      paymentStatus: 'pending'
    }).catch((err) => console.error('Failed to save order to the database (WhatsApp inquiry still sent):', err));
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentOption === 'whatsapp') {
      sendWhatsAppInquiry();
      return;
    }

    // --- Disabled for now — re-enable this block for the production payment launch. ---
    // if (paymentOption === 'lankapay') {
    //   setIsLankaPayOpen(true);
    //   return;
    // }
    //
    // // Standard CC payment flow simulation
    // if (!ccNumber || !ccExpiry || !ccCvc) {
    //   alert('Please fill in card credentials.');
    //   return;
    // }
    // setIsPlacingStandardOrder(true);
    // setTimeout(() => {
    //   setIsPlacingStandardOrder(false);
    //   executeOrderPlacement({
    //     gateway: 'Credit Card (Standard Clearance)',
    //     transactionId: `CC-${Math.floor(10000000 + Math.random() * 90000000)}`
    //   });
    // }, 2500);
  };

  if (cartItems.length === 0 && currentStep !== 'success') {
    return (
      <div className="bg-white text-black py-20 text-center uppercase font-mono">
        <p>No items detected in cart. Cannot initiate secure checkout.</p>
        <button onClick={() => setActivePage('collection')} className="mt-4 bg-black text-[#F4F4F5] px-6 py-3 text-xs tracking-widest font-bold">
          SHOP APPAREL
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-8 sm:py-16 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS STATE PAGE DISPLAY */}
        {currentStep === 'success' && finalOrder && (
          <div className="max-w-3xl mx-auto border border-black/10 p-6 sm:p-12 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <span className="text-4xl">📦</span>
              <span className="text-[10px] font-mono tracking-[0.3em] text-green-600 font-bold block uppercase">{finalOrder.paymentStatus === 'pending' ? 'INQUIRY SENT' : 'DISPATCH CONFIRMED'}</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">{finalOrder.paymentStatus === 'pending' ? 'WHATSAPP INQUIRY SENT' : 'ORDER RESOLVED SECURELY'}</h1>
              <p className="text-xs text-black/50 font-mono">ORDER ID: {finalOrder.id} • HASH: {Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
            </div>

            <hr className="border-black/15" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed uppercase font-mono text-black/70">
              <div className="space-y-2">
                <h3 className="font-bold text-black text-[10px] tracking-wider">SHIPPING DISPATCH DESTINATION</h3>
                <p>{finalOrder.customerInfo.firstName} {finalOrder.customerInfo.lastName}</p>
                <p>{finalOrder.customerInfo.address}</p>
                {finalOrder.customerInfo.apartment && <p>{finalOrder.customerInfo.apartment}</p>}
                <p>{finalOrder.customerInfo.city}, {finalOrder.customerInfo.postalCode}</p>
                <p>{finalOrder.customerInfo.country}</p>
                <p>PHONE: {finalOrder.customerInfo.phone}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-black text-[10px] tracking-wider">SETTLEMENT INVOICE DETAILS</h3>
                <p>CLEARANCE METHOD: {finalOrder.paymentMethod}</p>
                <p>STATUS: {finalOrder.paymentStatus === 'pending' ? 'PENDING — AWAITING WHATSAPP CONFIRMATION' : 'RESOLVED & CAPTURED'}</p>
                <p>TAX TARIFF: ${finalOrder.tax.toFixed(2)}</p>
                <p>SHIPPING FEE: {finalOrder.shipping === 0 ? 'FREE' : `$${finalOrder.shipping.toFixed(2)}`}</p>
                <p className="text-black font-bold text-sm pt-2">NET CHARGE: ${finalOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <hr className="border-black/15" />

            {/* Condensate order line recap */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-mono tracking-widest text-black/50 uppercase font-bold">COMMITTED CARGO ITEMS</h3>
              <div className="space-y-3">
                {finalOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-xs font-mono">
                    <span className="text-black/80 font-bold">{it.product.name} (x{it.quantity})</span>
                    <span className="text-black/50">SIZE: {it.selectedSize} | ${ (it.product.price * it.quantity).toFixed(2) }</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-50 border border-black/5 p-4 rounded-none text-xs font-mono text-black/60 leading-relaxed text-center uppercase">
              {finalOrder.paymentStatus === 'pending' ? (
                <>★ THANK YOU FOR YOUR INQUIRY. WE'VE OPENED WHATSAPP WITH YOUR ORDER DETAILS — SEND THE MESSAGE AND OUR TEAM WILL CONFIRM STOCK AND SHARE BANK TRANSFER DETAILS WITH YOU DIRECTLY.</>
              ) : (
                <>★ THANK YOU FOR TRANSACTING WITH IVORY. AN ENCRYPTED ORDER INVOICE AND DISPATCH TRACKING LINK WILL ARRIVE AT <span className="text-black font-bold">{finalOrder.customerInfo.email}</span> SHORTLY.</>
              )}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setActivePage('home');
                  setDiscountRate(0);
                  setDiscountCode('');
                }}
                className="bg-black hover:bg-black/80 text-[#F4F4F5] px-8 py-4 text-xs font-mono tracking-widest font-bold uppercase transition-all"
              >
                RETURN TO HOMEPAGE INDEX
              </button>
            </div>
          </div>
        )}

        {/* SECURE CHECKOUT FILL FORM (Left) AND ORDER SUMMARY PANEL (Right) */}
        {currentStep !== 'success' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Interactive Multi-Step form (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step indicator progress bar */}
              <div className="flex items-center justify-between border-b border-black/10 pb-6 text-[10px] font-mono tracking-widest font-bold uppercase">
                <button
                  onClick={() => setCurrentStep('information')}
                  className={`pb-2 border-b-2 ${currentStep === 'information' ? 'border-black text-black' : 'border-transparent text-black/30'}`}
                >
                  01. INFO
                </button>
                <div className="w-12 h-px bg-black/10 self-center mb-2" />
                <button
                  onClick={() => {
                    if (email && firstName && address) setCurrentStep('shipping');
                  }}
                  disabled={!email || !firstName}
                  className={`pb-2 border-b-2 ${currentStep === 'shipping' ? 'border-black text-black' : 'border-transparent text-black/30'}`}
                >
                  02. SHIPPING
                </button>
                <div className="w-12 h-px bg-black/10 self-center mb-2" />
                <button
                  disabled={currentStep !== 'payment'}
                  className={`pb-2 border-b-2 ${currentStep === 'payment' ? 'border-black text-black' : 'border-transparent text-black/30'}`}
                >
                  03. SETTLEMENT
                </button>
              </div>

              {/* Express checkout row shortcuts */}
              {currentStep === 'information' && (
                <div className="space-y-4">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-black/40 uppercase block font-bold">RAPID SECURE CHECKOUT</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono tracking-wider">
                    <button type="button" onClick={() => { setEmail('express-payer@shop.pay'); setFirstName('Jane'); setLastName('Doe'); setAddress('72 Streetwear Boulevard'); setCity('Colombo'); setPostalCode('00100'); setCurrentStep('shipping'); }} className="py-3 border border-black/10 hover:border-black bg-zinc-50 font-bold uppercase transition-all">SHOP PAY</button>
                    <button type="button" onClick={() => { setEmail('express-payer@paypal.com'); setFirstName('Marcus'); setLastName('Vane'); setAddress('12 Core Trackway'); setCity('Kandy'); setPostalCode('20000'); setCurrentStep('shipping'); }} className="py-3 border border-black/10 hover:border-black bg-zinc-50 font-bold uppercase transition-all">PAYPAL</button>
                    {/* LankaPay express shortcut disabled for now — re-enable for production launch.
                    <button type="button" onClick={() => { setPaymentOption('lankapay'); setIsLankaPayOpen(true); }} className="py-3 border border-black bg-black text-white hover:bg-black/80 font-bold uppercase transition-all">LANKAPAY®</button>
                    */}
                    <button type="button" onClick={() => { setEmail('express-payer@google.pay'); setFirstName('Zayd'); setLastName('Ray'); setAddress('54 Velocity Avenue'); setCity('Galle'); setPostalCode('80000'); setCurrentStep('shipping'); }} className="py-3 border border-black/10 hover:border-black bg-zinc-50 font-bold uppercase transition-all">G-PAY</button>
                  </div>
                </div>
              )}

              {/* STEP 1 FORM: INFORMATION */}
              {currentStep === 'information' && (
                <form onSubmit={handleInformationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">CONTACT INFO</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Email Address *</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Mobile Phone *</label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +94 77 123 4567" className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">DISPATCH ADDRESS</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">First Name *</label>
                        <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Last Name *</label>
                        <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Street Address *</label>
                      <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number and street name" className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Apartment, Suite, Unit, etc. (Optional)</label>
                      <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="e.g. Floor 4, Suite 4B" className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">City / State *</label>
                        <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Colombo" className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Postal Code *</label>
                        <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="00100" className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider text-black/60 block uppercase">Country *</label>
                        <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none h-[42px]">
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-black/80 text-[#F4F4F5] py-4 text-xs font-mono tracking-widest font-bold uppercase transition-colors"
                  >
                    CONTINUE TO SHIPPING METHOD
                  </button>
                </form>
              )}

              {/* STEP 2 FORM: SHIPPING */}
              {currentStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="bg-zinc-50 p-4 border border-black/5 text-xs font-mono space-y-2 uppercase text-black/70">
                    <div className="flex justify-between">
                      <span className="text-black/40">CONTACT EMAIL:</span>
                      <span>{email} ({phone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40">DISPATCH TO:</span>
                      <span className="text-right truncate max-w-sm">{address}, {city}, {country}</span>
                    </div>
                    <button type="button" onClick={() => setCurrentStep('information')} className="text-black underline text-[9px] tracking-widest font-bold uppercase hover:opacity-50">Change Info</button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">SELECT DELIVERY SPEED</h2>
                    <div className="space-y-3">
                      {/* Standard option */}
                      <label className="border border-black/15 p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-all select-none rounded-none">
                        <div className="flex items-center space-x-3">
                          <input type="radio" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="accent-black w-4 h-4 cursor-pointer" />
                          <div className="text-xs font-mono uppercase">
                            <span className="font-bold text-black block">STANDARD SECURED DISPATCH</span>
                            <span className="text-black/40 text-[10px]">Estimated delivery: 3-5 technical business days</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold">{subtotal >= settings.freeShippingThreshold ? 'FREE' : `$${settings.standardShippingCost.toFixed(2)}`}</span>
                      </label>

                      {/* Express option */}
                      <label className="border border-black/15 p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-all select-none rounded-none">
                        <div className="flex items-center space-x-3">
                          <input type="radio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="accent-black w-4 h-4 cursor-pointer" />
                          <div className="text-xs font-mono uppercase">
                            <span className="font-bold text-black block">RAPID CORE PRIORITY</span>
                            <span className="text-black/40 text-[10px]">Estimated delivery: 1-2 technical business days</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold">${settings.expressShippingCost.toFixed(2)}</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-2">
                    <button type="button" onClick={() => setCurrentStep('information')} className="border border-black/15 hover:border-black bg-white px-6 py-4 text-xs font-mono tracking-widest font-bold uppercase text-black">BACK</button>
                    <button type="submit" className="flex-grow bg-black hover:bg-black/80 text-[#F4F4F5] py-4 text-xs font-mono tracking-widest font-bold uppercase">CONTINUE TO PAYMENT METHOD</button>
                  </div>
                </form>
              )}

              {/* STEP 3 FORM: PAYMENT */}
              {currentStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Delivery details recap */}
                  <div className="bg-zinc-50 p-4 border border-black/5 text-xs font-mono space-y-2 uppercase text-black/70">
                    <div className="flex justify-between">
                      <span className="text-black/40">DELIVERY CARRIER:</span>
                      <span>{shippingMethod === 'express' ? `RAPID CORE PRIORITY ($${settings.expressShippingCost.toFixed(2)})` : `STANDARD SECURED (${subtotal >= settings.freeShippingThreshold ? 'FREE' : `$${settings.standardShippingCost.toFixed(2)}`})`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40">DESTINATION:</span>
                      <span className="text-right truncate max-w-sm">{address}, {city}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">SELECT SECURE CLEARANCE PATHWAY</h2>

                    {/*
                      LankaPay / Standard Card pathways are disabled until the production payment launch.
                      Left in place (behind `false &&`) so the real gateway can be switched back on later
                      by restoring `paymentOption` to the UI and re-enabling the branch in handlePaymentSubmit.
                    */}
                    {false && (
                      <div className="space-y-3">
                        <label className={`border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                          paymentOption === 'lankapay' ? 'border-black ring-1 ring-black' : 'border-black/15 hover:border-black/30 bg-zinc-50/50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input type="radio" checked={paymentOption === 'lankapay'} onChange={() => setPaymentOption('lankapay')} className="accent-black w-4 h-4 cursor-pointer" />
                            <div className="text-xs font-mono uppercase">
                              <span className="font-bold text-black block">LANKAPAY® SANDBOX GATEWAY (RECOMMENDED)</span>
                              <span className="text-black/40 text-[10px]">JustPay direct transfer, LankaQR, and local card clearing</span>
                            </div>
                          </div>
                          <Landmark size={18} className="text-black" />
                        </label>

                        <label className={`border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                          paymentOption === 'card' ? 'border-black ring-1 ring-black' : 'border-black/15 hover:border-black/30 bg-zinc-50/50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <input type="radio" checked={paymentOption === 'card'} onChange={() => setPaymentOption('card')} className="accent-black w-4 h-4 cursor-pointer" />
                            <div className="text-xs font-mono uppercase">
                              <span className="font-bold text-black block">STANDARD DEBIT / CREDIT CARDS</span>
                              <span className="text-black/40 text-[10px]">Global cards clearing via standard secure tokenization</span>
                            </div>
                          </div>
                          <CreditCard size={18} className="text-black" />
                        </label>
                      </div>
                    )}

                    {/* Active pathway: send an order inquiry via WhatsApp instead of taking payment directly. */}
                    <label className="border border-black ring-1 ring-black p-4 flex items-center justify-between select-none bg-zinc-50/50">
                      <div className="flex items-center space-x-3">
                        <input type="radio" checked readOnly className="accent-black w-4 h-4" />
                        <div className="text-xs font-mono uppercase">
                          <span className="font-bold text-black block">BANK TRANSFER — WHATSAPP INQUIRY</span>
                          <span className="text-black/40 text-[10px]">We'll confirm stock and share bank transfer details with you directly over WhatsApp</span>
                        </div>
                      </div>
                      <MessageCircle size={18} className="text-black" />
                    </label>
                  </div>

                  {/*
                    Dynamic card / LankaPay forms — disabled until the production payment launch, kept behind `false &&`.
                  */}
                  {false && paymentOption === 'card' && (
                    <div className="border border-black/10 p-5 space-y-4 bg-zinc-50 animate-in fade-in duration-200">
                      <h3 className="text-[10px] font-mono tracking-widest text-black/50 uppercase font-bold">SECURED CREDIT DATA</h3>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono tracking-wider text-black/60 block uppercase">Global Card Number</label>
                        <input type="text" required placeholder="4111 2222 3333 4444" value={ccNumber} onChange={(e) => setCcNumber(e.target.value)} className="w-full bg-white border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono tracking-wider text-black/60 block uppercase">Expiry MM/YY</label>
                          <input type="text" required placeholder="12/28" value={ccExpiry} onChange={(e) => setCcExpiry(e.target.value)} className="w-full bg-white border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono tracking-wider text-black/60 block uppercase">CVV / CVC Code</label>
                          <input type="password" required placeholder="***" maxLength={4} value={ccCvc} onChange={(e) => setCcCvc(e.target.value.replace(/\D/g, ''))} className="w-full bg-white border border-black/10 focus:border-black px-4 py-3 text-xs font-mono outline-none rounded-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {false && paymentOption === 'lankapay' && (
                    <div className="border border-black bg-zinc-950 text-white p-5 space-y-3 uppercase font-mono text-[10px] animate-in fade-in duration-200">
                      <div className="flex items-center space-x-2">
                        <Landmark size={14} className="text-white" />
                        <span className="font-bold tracking-widest">LANKAPAY CO-SETTLEMENT ACTIVE</span>
                      </div>
                      <p className="text-[#A1A1AA] leading-relaxed text-[9px]">
                        Selecting LankaPay as your clearing channel routes you to the Sri Lankan banking sandbox. Click "PLACE SECURE ORDER" to initiate bank details and verify transaction pins.
                      </p>
                    </div>
                  )}

                  {/* Billing address toggle */}
                  <label className="flex items-center space-x-3 text-xs font-mono text-black/60 cursor-pointer uppercase select-none pb-2">
                    <input type="checkbox" defaultChecked className="accent-black w-4 h-4 cursor-pointer" />
                    <span>Billing address same as dispatch address</span>
                  </label>

                  <div className="flex space-x-4 pt-2">
                    <button type="button" onClick={() => setCurrentStep('shipping')} className="border border-black/15 hover:border-black bg-white px-6 py-4 text-xs font-mono tracking-widest font-bold uppercase text-black">BACK</button>
                    <button
                      type="submit"
                      disabled={isPlacingStandardOrder}
                      className="flex-grow bg-black hover:bg-black/80 text-[#F4F4F5] py-4 text-xs font-mono tracking-widest font-bold uppercase flex items-center justify-center space-x-2 disabled:opacity-55"
                    >
                      {isPlacingStandardOrder ? (
                        <>
                          <Loader2 className="animate-spin text-white" size={14} />
                          <span>CAPTURING SECURE FUNDS...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle size={14} className="text-white" />
                          <span>SEND INQUIRY VIA WHATSAPP (${totalAmount.toFixed(2)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Right: Condensed Order Summary Sidebar (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border border-black/10 p-6 sm:p-8 bg-zinc-50 space-y-6">
                <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold border-b border-black/5 pb-3">CARGO REVIEW</h2>
                
                {/* Line Item recap list */}
                <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3 items-center justify-between border-b border-black/5 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-12 bg-white shrink-0 border border-black/5">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover filter grayscale contrast-105" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-0.5 text-xs">
                          <h4 className="font-bold uppercase tracking-wide text-black text-[11px] line-clamp-1">{item.product.name}</h4>
                          <p className="text-[10px] font-mono text-black/40 uppercase">QTY: {item.quantity} | SIZE: {item.selectedSize}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-black">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal summary breakdowns */}
                <div className="space-y-2.5 text-xs font-mono uppercase">
                  <div className="flex justify-between text-black/60">
                    <span>ITEMS SUB-SUM</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountRate > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>CAMPAIGN PROMO ({Math.round(discountRate * 100)}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-black/60">
                    <span>DISPATCH SPEED TARIFF</span>
                    <span>{shippingCharge === 0 ? 'COMPLIMENTARY' : `$${shippingCharge.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-black/60">
                    <span>ESTIMATED TAX TARIFF ({Math.round(settings.taxRate * 100)}%)</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-black/10 pt-4 flex justify-between items-baseline">
                    <span className="text-sm font-bold tracking-widest text-black">NET CLEARANCE CHARGE</span>
                    <span className="text-base sm:text-lg font-bold font-mono text-black">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo duplicate from cart page */}
                <form onSubmit={handleApplyPromo} className="pt-2 border-t border-black/5">
                  <div className="relative flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-grow bg-white text-black border border-black/10 focus:border-black px-3 py-2.5 text-[10px] font-mono uppercase tracking-wider rounded-none outline-none"
                    />
                    <button type="submit" className="bg-black hover:bg-black/80 text-white px-4 text-[10px] font-mono tracking-widest font-bold uppercase rounded-none">APPLY</button>
                  </div>
                  {promoMsg && <p className="text-[10px] font-mono text-black/50 pt-2">{promoMsg}</p>}
                </form>

                {/* Trust and security badges block */}
                <div className="border-t border-black/5 pt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-black/50 uppercase">
                    <ShieldCheck size={14} className="text-black" />
                    <span>LANKAPAY TRUST SECURE COMPLIANT</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-black/50 uppercase">
                    <Lock size={14} className="text-black" />
                    <span>SSL SECURED AES CERTIFIED LAYER</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* SECURE LANKAPAY SIMULATION MODAL OVERLAY */}
      <LankaPayModal
        isOpen={isLankaPayOpen}
        onClose={() => setIsLankaPayOpen(false)}
        orderTotal={totalAmount}
        onPaymentSuccess={(details) => executeOrderPlacement(details)}
        onPaymentFailed={(err) => alert(`Payment Failed: ${err}. Please retry.`)}
      />
    </div>
  );
}
