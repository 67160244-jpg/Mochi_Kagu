import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FxToggle } from './FxToggle';
import { CurrencyMode, CONFIG } from '../config/fx';
import { Menu, X, Sparkles, BookOpen, Search, Sliders, Database, Info } from 'lucide-react';

interface NavbarProps {
  currency: CurrencyMode;
  onCurrencyChange: (c: CurrencyMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currency, onCurrencyChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'เรื่องเล่า (Story)', icon: BookOpen },
    { to: '/explorer', label: 'สำรวจข้อมูล (Explorer)', icon: Search },
    { to: '/price-lab', label: 'ห้องทดลองราคา (Price Lab)', icon: Sliders },
    { to: '/data', label: 'แหล่งข้อมูล & คุณภาพ', icon: Database },
    { to: '/about', label: 'เกี่ยวกับ (About)', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-mochi-cream/90 backdrop-blur-md border-b border-mochi-lavender/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-mochi-pink rounded-full p-1"
          aria-label="กลับสู่หน้าแรก Mochi Kagu"
        >
          <div className="w-10 h-10 rounded-full bg-mochi-pink flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
            🍡
          </div>
          <div>
            <div className="font-display font-bold text-xl text-mochi-brown-dark tracking-tight leading-tight flex items-center gap-1.5">
              <span>{CONFIG.BRAND_NAME}</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-mochi-lavender text-mochi-brown-dark">
                Japandi Custom
              </span>
            </div>
            <div className="text-[11px] text-mochi-brown/70 leading-none hidden sm:block">
              AI Co-Design & Real-Time Pricing
            </div>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/70 p-1.5 rounded-full border border-mochi-lavender/50 shadow-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-mochi-pink text-mochi-brown-dark font-semibold shadow-xs'
                      : 'text-mochi-brown/80 hover:text-mochi-brown-dark hover:bg-mochi-lavender-light/70'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right side: Currency switch & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <FxToggle currentCurrency={currency} onToggle={onCurrencyChange} />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-mochi-sm text-mochi-brown hover:bg-mochi-lavender-light focus:outline-none focus-visible:ring-2 focus-visible:ring-mochi-pink"
            aria-label={mobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-mochi-lavender/40 bg-white/95 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          <div className="grid gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-mochi text-sm font-medium flex items-center gap-3 transition-colors ${
                      isActive
                        ? 'bg-mochi-pink text-mochi-brown-dark font-semibold'
                        : 'text-mochi-brown hover:bg-mochi-lavender-light'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-mochi-wood-dark" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
