import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Instagram, Github, Twitter, ShieldAlert } from 'lucide-react';
import { ActivePage, StaticPageType, LinkTarget } from '../types';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
  setStaticPageType: (type: StaticPageType) => void;
}

export default function Footer({ setActivePage, setStaticPageType }: FooterProps) {
  const { footer } = useSiteContent();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleStaticClick = (pageType: StaticPageType) => {
    setStaticPageType(pageType);
    setActivePage('static');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Resolves a CMS-managed footer link's target (see Settings > Footer in the admin portal).
  const handleLinkTarget = (target: LinkTarget) => {
    if (target === 'home' || target === 'collection') {
      setActivePage(target);
    } else {
      handleStaticClick(target);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-black text-[#F4F4F5] border-t border-[#27272A] mt-auto">
      {/* Upper footer / Newsletter block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-[#27272A]">
        {/* Newsletter Section */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-mono tracking-[0.2em] text-[#A1A1AA] uppercase">{footer.newsletterHeading}</h2>
          <p className="text-xs text-[#D4D4D8] leading-relaxed max-w-sm">
            {footer.newsletterBody}
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md pt-2">
            <div className="relative flex-grow">
              <input
                type="email"
                required
                placeholder="YOUR EMAIL ADRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18181B] text-white border border-[#3F3F46] focus:border-white px-4 py-3 text-xs tracking-wider font-mono rounded-none outline-none transition-colors uppercase placeholder:text-zinc-600"
              />
              <Mail className="absolute right-3.5 top-3.5 text-zinc-500" size={14} />
            </div>
            <button
              type="submit"
              className="bg-white text-black hover:bg-[#E4E4E7] px-6 py-3 text-[10px] font-mono tracking-widest font-bold transition-colors flex items-center justify-center space-x-2 shrink-0 rounded-none uppercase"
            >
              {subscribed ? (
                <>
                  <Check size={12} className="text-green-600" />
                  <span>SUBSCRIBED</span>
                </>
              ) : (
                <>
                  <span>REGISTER</span>
                  <ArrowRight size={12} />
                </>
              )}
            </button>
          </form>
          {subscribed && (
            <p className="text-[10px] text-green-400 font-mono tracking-wider animate-pulse">
              ✓ ENROLLMENT SUCCESSFUL. WELCOME TO THE NETWORK.
            </p>
          )}
        </div>

        {/* Vertical Links Grid — columns are CMS-managed (admin portal > Header & Footer) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {footer.columns.map((column, colIndex) => (
            <div key={column.heading} className={colIndex === footer.columns.length - 1 ? 'space-y-4 col-span-2 sm:col-span-1' : 'space-y-4'}>
              <h3 className="text-xs font-mono tracking-[0.2em] text-[#A1A1AA] uppercase">{column.heading}</h3>
              <ul className="space-y-2.5 text-xs">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleLinkTarget(link.target)}
                      className="text-[#D4D4D8] hover:text-white transition-colors uppercase text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Lower footer / Copyright and legal line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-[#71717A] tracking-wider uppercase space-y-4 md:space-y-0">
        <div>
          © {new Date().getFullYear()} {footer.copyright}
        </div>
        
        {/* Social link icons */}
        <div className="flex space-x-6">
          <a href="#instagram" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram size={14} />
          </a>
          <a href="#github" className="hover:text-white transition-colors" aria-label="Github">
            <Github size={14} />
          </a>
          <a href="#twitter" className="hover:text-white transition-colors" aria-label="Twitter">
            <Twitter size={14} />
          </a>
        </div>

        <div className="flex items-center space-x-1">
          <ShieldAlert size={12} className="text-zinc-600" />
          <span>{footer.complianceBadge}</span>
        </div>
      </div>
    </footer>
  );
}
