import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { BrandLogo } from './BrandLogo';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from './NavLinks';

interface SiteHeaderProps {
  variant?: 'standard' | 'hero-mobile-only';
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ variant = 'standard' }) => {
  const { pathname, search, navigate } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, search]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(href);
  };

  const isNavItemActive = (href: string) => {
    const fullCurrent = `${pathname}${search}`;
    if (href.includes('?')) {
      return fullCurrent === href;
    }
    if (href === '/properties') {
      return pathname === '/properties' && !search.includes('transaction=');
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={`w-full bg-white ${
          variant === 'hero-mobile-only'
            ? 'lg:hidden border-b border-slate-100'
            : 'border-b border-slate-200/80 sticky top-0 z-40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="whitespace-nowrap shrink-0 rounded-lg focus-visible:outline-[#1E40AF]"
            aria-label="Naeleseneh Properties Limited Home"
          >
            <BrandLogo variant="header" />
          </a>

          {variant === 'standard' && (
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700"
            >
              {PRIMARY_NAV_ITEMS.map((item) => {
                const active = isNavItemActive(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    aria-current={active ? 'page' : undefined}
                    className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                      active
                        ? 'text-[#1E40AF] font-semibold border-[#1E40AF]'
                        : 'border-transparent hover:text-[#1E40AF] hover:border-[#1E40AF]/40'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {variant === 'standard' && (
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="hidden lg:inline-flex items-center gap-1.5 group whitespace-nowrap shrink-0"
              >
                <span className="px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold group-hover:bg-[#17358F] transition-colors">
                  Contact Us
                </span>
                <span className="w-10 h-10 rounded-full bg-[#1E40AF] text-white inline-flex items-center justify-center group-hover:bg-[#17358F] transition-colors">
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </a>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 text-slate-800 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-sm"
          >
            {[...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS].map((item) => {
              const active = isNavItemActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`block px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#EFF6FF] text-[#1E40AF]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-2">
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors"
              >
                <span>Contact Us</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};
