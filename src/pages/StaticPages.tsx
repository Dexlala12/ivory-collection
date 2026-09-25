import React, { useState } from 'react';
import { Mail, Landmark, Phone, Clock, MapPin, Send, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { StaticPageType, ActivePage } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface StaticPagesProps {
  pageType: StaticPageType;
  setPageType: (type: StaticPageType) => void;
  setActivePage: (page: ActivePage) => void;
}

const HUB_STORES = [
  {
    name: 'COLOMBO CONCEPT FLAGSHIP',
    address: '42 Galle Face Court, Colombo 03, Sri Lanka',
    phone: '+94 11 234 5678',
    hours: 'Monday – Sunday: 10:00 – 20:00',
    lat: '6.9272',
    lng: '79.8443'
  },
  {
    name: 'KANDY MOUNTAIN CORE LAB',
    address: '88 Dalada Veediya, Kandy, Sri Lanka',
    phone: '+94 81 234 5678',
    hours: 'Monday – Saturday: 09:30 – 19:00',
    lat: '7.2906',
    lng: '80.6337'
  },
  {
    name: 'GALLE FORT ARCHIVE CELL',
    address: '15 Pedlar Street, Galle Fort, Sri Lanka',
    phone: '+94 91 234 5678',
    hours: 'Tuesday – Sunday: 10:00 – 19:30',
    lat: '6.0331',
    lng: '80.2154'
  }
];

export default function StaticPages({ pageType, setPageType, setActivePage }: StaticPagesProps) {
  const { faqs: FAQS, pages } = useSiteContent();

  // Contact states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('TECHNICAL SPEC INQUIRY');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ accordion state: stores index of active FAQ
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Selected store hub in map locator
  const [activeHubIndex, setActiveHubIndex] = useState(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setContactSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSubmitted(false), 5000);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="bg-white text-black animate-in fade-in duration-300">
      
      {/* 1. PAGE BANNER */}
      <section className="relative bg-zinc-950 text-white py-16 sm:py-24 text-center overflow-hidden border-b border-black/10">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1920&auto=format&fit=crop" 
            alt="Static page atmospheric banner" 
            className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-black/60" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-3 uppercase">
          {/* Breadcrumb path */}
          <div className="flex items-center justify-center space-x-2 text-[9px] font-mono tracking-widest text-[#A1A1AA]">
            <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">HOME</button>
            <span>/</span>
            <span>{pageType}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none mt-2">
            {pageType === 'about' && pages.about.title}
            {pageType === 'faq' && 'TECHNICAL SUPPORT / FAQ'}
            {pageType === 'contact' && 'CONNECT & HUBS'}
            {pageType === 'terms' && pages.terms.title}
            {pageType === 'privacy' && pages.privacy.title}
          </h1>

          <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 max-w-lg mx-auto">
            {pageType === 'about' && pages.about.subtitle}
            {pageType === 'faq' && 'System configuration guidelines and allocation notes.'}
            {pageType === 'contact' && 'Interactive stores, digital portals, and customer centers.'}
            {pageType === 'terms' && pages.terms.subtitle}
            {pageType === 'privacy' && pages.privacy.subtitle}
          </p>
        </div>
      </section>

      {/* 2. MAIN STATIC CONTENT VIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
        
        {/* Dynamic Static Views */}
        
        {/* ABOUT / CONCEPT PAGE */}
        {pageType === 'about' && (
          <div className="space-y-12">
            {pages.about.sections.map((section, i) => (
              <div key={i} className="space-y-6 text-xs sm:text-sm text-black/75 leading-relaxed font-sans max-w-3xl">
                {section.heading && (
                  <h2 className="text-sm font-mono tracking-[0.2em] text-black font-bold uppercase">{section.heading}</h2>
                )}
                {section.paragraphs.map((p, j) => <p key={j}>{p}</p>)}

                {/* Inline lifestyle images block sits between the first and second section, matching the original layout */}
                {i === 0 && pages.about.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    {pages.about.images.map((img, k) => (
                      <div key={k} className="space-y-2">
                        <div className="aspect-[4/3] bg-zinc-100 overflow-hidden border border-black/5">
                          <img src={img.url} alt={img.caption} className="w-full h-full object-cover filter grayscale contrast-110" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[9px] font-mono tracking-widest text-black/40 uppercase block text-center">{img.caption}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 text-center">
              <button
                onClick={() => { setActivePage('collection'); }}
                className="bg-black hover:bg-black/85 text-white px-8 py-4 text-xs font-mono tracking-widest font-bold uppercase transition-colors"
              >
                DISCOVER THE COLLECTION
              </button>
            </div>
          </div>
        )}

        {/* FAQ PAGE */}
        {pageType === 'faq' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-sm font-mono tracking-[0.2em] text-black font-bold uppercase border-b border-black/10 pb-3">ACCORDION QUESTION DIRECTORY</h2>
            
            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = expandedFaqIndex === index;
                return (
                  <div
                    key={faq.id}
                    id={`faq-item-${index}`}
                    className="border border-black/15 bg-white transition-all overflow-hidden"
                  >
                    {/* Header Question */}
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left p-5 flex justify-between items-center hover:bg-zinc-50 transition-colors uppercase font-mono tracking-wider font-bold text-xs"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Expandable answer */}
                    {isOpen && (
                      <div className="p-5 border-t border-black/10 text-xs text-black/70 leading-relaxed font-sans bg-zinc-50/50 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONNECT / CONTACT PAGE */}
        {pageType === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Contact Form side (5 cols) */}
            <div className="md:col-span-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">DIGITAL PORTAL</h2>
                <h3 className="text-lg font-bold uppercase">CONNECT SECURE INQUIRIES</h3>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-black/60 uppercase block">FullName *</label>
                  <input 
                    type="text" 
                    required 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="ENTER YOUR FULL NAME" 
                    className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs outline-none rounded-none uppercase" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-black/60 uppercase block">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="YOUR@EMAIL.COM" 
                    className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs outline-none rounded-none uppercase" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-black/60 uppercase block">Subject Inquiry *</label>
                  <select 
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs outline-none rounded-none h-[42px]"
                  >
                    <option value="TECHNICAL SPEC INQUIRY">TECHNICAL SPEC INQUIRY</option>
                    <option value="ORDER ALLOCATION TRACKING">ORDER ALLOCATION TRACKING</option>
                    <option value="LANKAPAY SANDBOX DISCREPANCY">LANKAPAY DISCREPANCY</option>
                    <option value="RETURNS & RECYCLING COMPACT">RETURNS & RECYCLING COMPACT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-wider text-black/60 uppercase block">Message Briefing *</label>
                  <textarea 
                    required 
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="DESCRIBE YOUR INQUIRY BRIEFLY IN CAPS OR standard text" 
                    className="w-full bg-zinc-50 border border-black/10 focus:border-black px-4 py-3 text-xs outline-none rounded-none uppercase resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-black/85 text-[#F4F4F5] py-4.5 text-xs font-mono tracking-widest font-bold uppercase transition-all flex items-center justify-center space-x-2"
                >
                  {contactSubmitted ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      <span>DISPATCH COMPLETED</span>
                    </>
                  ) : (
                    <>
                      <span>DISPATCH INQUIRY REPORT</span>
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
              {contactSubmitted && (
                <p className="text-[10px] text-green-600 font-mono tracking-wider text-center pt-2 animate-pulse uppercase">
                  ✓ DISPATCH COMPLETED. RECEPTOR ENVELOPE RECORDED. WE WILL INITIATE CONTACT WITHIN 12 HOURS.
                </p>
              )}
            </div>

            {/* Hubs / Stores Map Locator (6 cols) */}
            <div className="md:col-span-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase font-bold">PHYSICAL STATIONS</h2>
                <h3 className="text-lg font-bold uppercase">STORE LOCATOR & MAP EMBED</h3>
              </div>

              {/* Selector buttons */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {HUB_STORES.map((hub, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHubIndex(idx)}
                    className={`py-2 px-3 text-[9px] font-mono tracking-wider uppercase border text-center whitespace-nowrap transition-all ${
                      activeHubIndex === idx ? 'border-black bg-black text-white font-bold' : 'border-black/10 hover:border-black/30 bg-zinc-50'
                    }`}
                  >
                    {hub.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Selected store specs details */}
              <div className="p-5 border border-black/10 space-y-4 bg-zinc-50/50 uppercase font-mono text-[10px]">
                <h4 className="font-bold text-black text-xs leading-none">{HUB_STORES[activeHubIndex].name}</h4>
                <div className="space-y-2 text-black/75">
                  <p className="flex items-start space-x-2">
                    <MapPin size={14} className="text-black/40 shrink-0 mt-0.5" />
                    <span>{HUB_STORES[activeHubIndex].address}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Phone size={14} className="text-black/40 shrink-0" />
                    <span>{HUB_STORES[activeHubIndex].phone}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Clock size={14} className="text-black/40 shrink-0" />
                    <span>{HUB_STORES[activeHubIndex].hours}</span>
                  </p>
                </div>
              </div>

              {/* High-fidelity Vector map embed simulator */}
              <div className="aspect-[16/10] bg-[#111111] border border-black/10 relative overflow-hidden flex items-center justify-center text-white">
                {/* Simulated coordinate grids and abstract location plot */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-500 uppercase">
                  ACTIVE GPS GRID PLOTTER • LAT: {HUB_STORES[activeHubIndex].lat} / LNG: {HUB_STORES[activeHubIndex].lng}
                </div>
                
                {/* Graphic representation of Sri Lanka coastline outline */}
                <div className="relative w-24 h-40 border border-zinc-800/40 rounded-full flex items-center justify-center scale-95 grayscale opacity-20">
                  <div className="absolute w-20 h-32 border border-dashed border-zinc-700/30 rounded-full animate-ping" />
                </div>

                {/* Plot indicator */}
                <div className="absolute flex flex-col items-center justify-center space-y-1.5 z-10 animate-bounce">
                  <div className="w-4 h-4 bg-white border border-black flex items-center justify-center rounded-full">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                  <span className="bg-white text-black px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase font-bold border border-black">
                    {HUB_STORES[activeHubIndex].name.split(' ')[0]} PLOT
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 text-[8px] font-mono text-zinc-600">
                  SATELLITE ORBIT CAPTURE OK
                </div>
              </div>

            </div>

          </div>
        )}

        {/* POLICY TERMINOLOGY PAGES (TERMS / PRIVACY) */}
        {(pageType === 'terms' || pageType === 'privacy') && (
          <div className="space-y-8 font-sans text-xs sm:text-sm text-black/75 leading-relaxed max-w-3xl mx-auto">
            <h2 className="text-sm font-mono tracking-[0.2em] text-black font-bold uppercase border-b border-black/10 pb-3">
              {pages[pageType].heading}
            </h2>

            <div className="space-y-6">
              {pages[pageType].sections.map((section, i) => (
                <React.Fragment key={i}>
                  {section.heading && (
                    <p className="font-bold text-black font-mono uppercase text-[10px]">{section.heading}</p>
                  )}
                  {section.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* CLOSING CTA BLOCK */}
        <hr className="border-black/10" />
        <div className="text-center space-y-4 pt-4 uppercase">
          <h4 className="text-[10px] font-mono tracking-widest text-black/50 font-bold">READY TO GEAR UP?</h4>
          <p className="text-xs text-black/60 max-w-sm mx-auto leading-relaxed">
            Return to our core classified catalog to explore advanced compression gear.
          </p>
          <button
            onClick={() => setActivePage('collection')}
            className="border border-black hover:bg-zinc-50 px-6 py-3.5 text-[10px] font-mono tracking-widest font-bold uppercase transition-all"
          >
            EXPLORE ALL APPAREL CATALOGUE
          </button>
        </div>

      </section>

    </div>
  );
}
