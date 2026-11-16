import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { MEDIA_ASSETS } from '../data/media';
import { BrandLogo } from './BrandLogo';
import { PRIMARY_NAV_ITEMS } from './NavLinks';
import { SiteHeader } from './SiteHeader';
import { SmartImage } from './SmartImage';

export const HeroSection: React.FC = () => {
  const { navigate, pathname, search } = useAppState();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };

  const isNavItemActive = (href: string) => {
    const full = `${pathname}${search}`;
    if (href.includes('?')) return full === href;
    if (href === '/properties') return pathname === '/properties' && !search.includes('transaction=');
    return pathname === href;
  };

  return (
    <div className="bg-white">
      {/* Compact header on tablet & phone when sculpted links no longer fit comfortably */}
      <SiteHeader variant="hero-mobile-only" />

      <div className="max-w-[1440px] mx-auto px-3 pt-2.5 sm:px-5 sm:pt-4 lg:px-6 lg:pt-5">
        <section
          aria-label="Hero showcase"
          className="relative rounded-[26px] sm:rounded-[32px] lg:rounded-[34px] overflow-hidden min-h-[510px] sm:min-h-[570px] lg:min-h-[650px] xl:min-h-[680px] bg-slate-100 flex flex-col justify-between"
        >
          {/* Full-bleed right-weighted contemporary architectural photograph */}
          <div className="absolute inset-0 z-0">
            <SmartImage
              src={MEDIA_ASSETS.heroResidence}
              alt="Contemporary residence bathed in warm late-afternoon light with open coastal sky on the left"
              priority
              sizes="(max-width: 1440px) 100vw, 1400px"
              className="w-full h-full object-cover object-[76%_center] sm:object-[68%_center] lg:object-right"
            />
            {/* Soft local contrast scrim behind left-aligned copy and mobile upper region */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/72 to-white/10 sm:bg-gradient-to-r sm:from-white/88 sm:via-white/48 sm:to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Sculpted curved desktop header integrated into top edge of hero */}
          <div className="hidden lg:block relative z-20 w-full">
            {/* Subtle recessed frosted channel behind center navigation */}
            <div
              className="absolute top-0 left-28 right-28 h-[62px] bg-[#EEF2F7]/78 backdrop-blur-md border-b border-white/50 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative flex items-start justify-between">
              {/* Upper-left white cutout panel for logo */}
              <div className="relative z-10 bg-white pl-3 pr-7 pt-2 pb-4 rounded-br-[28px] shrink-0">
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, '/')}
                  className="inline-flex items-center rounded-lg focus-visible:outline-[#1E40AF]"
                  aria-label="Naeleseneh Properties Limited Home"
                >
                  <BrandLogo variant="header" />
                </a>

                {/* Concave curve joining bottom of logo panel to left edge of hero */}
                <svg
                  viewBox="0 0 28 28"
                  className="w-7 h-7 fill-white absolute left-0 -bottom-7 pointer-events-none"
                  aria-hidden="true"
                >
                  <path d="M 0 0 L 28 0 A 28 28 0 0 0 0 28 Z" />
                </svg>

                {/* Concave curve joining right edge of logo panel to recessed center bar */}
                <svg
                  viewBox="0 0 28 28"
                  className="w-7 h-7 fill-white absolute top-0 -right-7 pointer-events-none"
                  aria-hidden="true"
                >
                  <path d="M 0 0 L 28 0 A 28 28 0 0 0 0 28 Z" />
                </svg>
              </div>

              {/* Recessed center navigation links */}
              <nav
                aria-label="Primary navigation"
                className="relative z-10 h-[62px] flex items-center justify-center gap-6 xl:gap-8 px-4"
              >
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const active = isNavItemActive(item.href);
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      aria-current={active ? 'page' : undefined}
                      className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                        active
                          ? 'text-[#1E40AF] font-semibold border-[#1E40AF]'
                          : 'text-slate-900 border-transparent hover:text-[#1E40AF] hover:border-[#1E40AF]/50'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              {/* Upper-right white cutout panel for Contact Us pill + circular arrow */}
              <div className="relative z-10 bg-white pl-7 pr-3 pt-2 pb-4 rounded-bl-[28px] shrink-0">
                <a
                  href="/contact"
                  onClick={(e) => handleNavClick(e, '/contact')}
                  className="inline-flex items-center gap-1.5 group whitespace-nowrap shrink-0 rounded-full"
                >
                  <span className="px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold group-hover:bg-[#17358F] transition-colors">
                    Contact Us
                  </span>
                  <span className="w-10 h-10 rounded-full bg-[#1E40AF] text-white inline-flex items-center justify-center group-hover:bg-[#17358F] transition-colors">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </a>

                {/* Concave curve joining bottom of CTA panel to right edge of hero */}
                <svg
                  viewBox="0 0 28 28"
                  className="w-7 h-7 fill-white absolute right-0 -bottom-7 pointer-events-none"
                  aria-hidden="true"
                >
                  <path d="M 28 0 L 0 0 A 28 28 0 0 1 28 28 Z" />
                </svg>

                {/* Concave curve joining left edge of CTA panel to recessed center bar */}
                <svg
                  viewBox="0 0 28 28"
                  className="w-7 h-7 fill-white absolute top-0 -left-7 pointer-events-none"
                  aria-hidden="true"
                >
                  <path d="M 28 0 L 0 0 A 28 28 0 0 1 28 28 Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hero left-aligned editorial headline & primary CTA */}
          <div className="relative z-10 flex-1 flex items-start lg:items-center px-5 pt-8 pb-12 sm:px-10 sm:pt-12 lg:px-16 lg:pt-4 lg:pb-14">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase mb-4">
                <span>Philo Eseneh &amp; Co</span>
                <span className="h-px w-12 bg-slate-400/80" aria-hidden="true" />
              </div>

              <h1 className="text-[clamp(1.85rem,4.3vw,3.9rem)] font-extrabold tracking-[-0.03em] leading-[1.08] text-balance">
                <span className="block text-slate-950">Find a Property</span>
                <span className="block text-[#1E40AF]">That Fits Your Plans.</span>
              </h1>

              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-700 max-w-md leading-relaxed font-medium">
                Explore land and properties for sale, rent, and lease.
              </p>

              <div className="mt-7 sm:mt-8">
                <a
                  href="/properties"
                  onClick={(e) => handleNavClick(e, '/properties')}
                  className="inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#1E40AF] text-white text-sm sm:text-base font-semibold hover:bg-[#17358F] transition-colors group shadow-sm whitespace-nowrap"
                >
                  <span>Explore Properties</span>
                  <span className="w-9 h-9 rounded-full bg-white text-[#1E40AF] inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
