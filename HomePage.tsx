import React, { useEffect, useMemo } from 'react';
import { ArrowRight, ArrowUpRight, Building2, KeyRound, Landmark } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { PropertyCard } from '../components/PropertyCard';
import { QuickSearchBar } from '../components/QuickSearchBar';
import { useAppState } from '../context/AppStateContext';

export const HomePage: React.FC = () => {
  const { listings, siteConfig, navigate, setPageMeta } = useAppState();

  useEffect(() => {
    setPageMeta({
      title: siteConfig.seo.defaultTitle,
      description: siteConfig.seo.defaultDescription,
    });
  }, [setPageMeta, siteConfig.seo.defaultDescription, siteConfig.seo.defaultTitle]);

  const publishedListings = useMemo(
    () => listings.filter((item) => item.published),
    [listings]
  );

  const featuredListings = useMemo(() => {
    const flagged = publishedListings.filter((item) => item.featured);
    return (flagged.length > 0 ? flagged : publishedListings).slice(0, 3);
  }, [publishedListings]);

  const recentListings = useMemo(() => {
    const featuredIds = new Set(featuredListings.map((f) => f.id));
    const remaining = publishedListings.filter((item) => !featuredIds.has(item.id));
    return (remaining.length >= 3 ? remaining : publishedListings).slice(0, 3);
  }, [featuredListings, publishedListings]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <main>
      <HeroSection />
      <QuickSearchBar />

      {/* Featured Properties (Photo-led asymmetric showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
              Featured Selection · Sample Preview
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Highlighted Land &amp; Residences
            </h2>
          </div>
          <a
            href="/properties"
            onClick={(e) => handleNav(e, '/properties')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E40AF] hover:text-[#17358F] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Browse all properties</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {featuredListings.length > 0 ? (
          <div className="space-y-6">
            <PropertyCard listing={featuredListings[0]} featuredLayout priority />
            {featuredListings.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredListings.slice(1, 3).map((item) => (
                  <PropertyCard key={item.id} listing={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl p-8 text-center text-slate-600">
            No featured properties are currently published in this session.
          </div>
        )}
      </section>

      {/* Concise Company Introduction & Services Overview */}
      <section className="bg-slate-50/80 border-y border-slate-200/70 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
                About {siteConfig.company.tradingName}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Structured Real Estate Transactions Built on Clear Documentation
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                {siteConfig.company.legalName} ({siteConfig.company.tradingName}) assists buyers, tenants, landlords, and corporate investors with acquiring, selling, renting, and leasing landed and developed properties.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/about"
                  onClick={(e) => handleNav(e, '/about')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>About Our Company</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E40AF] hover:text-[#17358F] transition-colors"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E40AF] inline-flex items-center justify-center mb-4">
                    <Landmark className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    01. Landed Property Sales
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Acquisition and sale of residential plots, commercial acreage, and developed homes with guided due diligence.
                  </p>
                </div>
                <a
                  href="/properties?transaction=sale"
                  onClick={(e) => handleNav(e, '/properties?transaction=sale')}
                  className="text-xs font-semibold text-[#1E40AF] hover:underline"
                >
                  View Sale Listings →
                </a>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E40AF] inline-flex items-center justify-center mb-4">
                    <KeyRound className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    02. Property Rentals
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Matching residential and commercial tenants with well-maintained apartments, houses, and retail suites.
                  </p>
                </div>
                <a
                  href="/properties?transaction=rent"
                  onClick={(e) => handleNav(e, '/properties?transaction=rent')}
                  className="text-xs font-semibold text-[#1E40AF] hover:underline"
                >
                  View Rental Listings →
                </a>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1E40AF] inline-flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    03. Commercial &amp; Land Leasing
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    Structured multi-year commercial office leases and long-term ground leases for landed assets.
                  </p>
                </div>
                <a
                  href="/properties?transaction=lease"
                  onClick={(e) => handleNav(e, '/properties?transaction=lease')}
                  className="text-xs font-semibold text-[#1E40AF] hover:underline"
                >
                  View Lease Listings →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
              Directory Preview · Sample Entries
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Recent Listings Across Sale, Rent &amp; Lease
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/properties?category=land"
              onClick={(e) => handleNav(e, '/properties?category=land')}
              className="px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
            >
              Landed Properties
            </a>
            <a
              href="/properties"
              onClick={(e) => handleNav(e, '/properties')}
              className="px-4 py-2 rounded-full bg-[#EFF6FF] text-xs font-semibold text-[#1E40AF] hover:bg-blue-100 transition-colors"
            >
              All Directory Listings
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentListings.map((item) => (
            <PropertyCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      {/* Approved Testimonials (Only displayed when approved copy is supplied) */}
      {siteConfig.testimonials.approvedItems.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50/70 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
                Client Feedback
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                What Clients Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteConfig.testimonials.approvedItems.map((t) => (
                <blockquote
                  key={t.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4"
                >
                  <p className="text-sm text-slate-700 leading-relaxed">“{t.quote}”</p>
                  <footer className="pt-3 border-t border-slate-100 text-xs">
                    <div className="font-bold text-slate-900">{t.clientName}</div>
                    <div className="text-slate-500">{t.roleOrContext}</div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clear Contact CTA Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="rounded-[28px] bg-[#1E40AF] text-white px-6 py-10 sm:px-12 sm:py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-200 uppercase">
              Direct Advisory &amp; Inspections
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Planning a Purchase, Tenancy, or Property Listing?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              Send an enquiry with your preferred location, budget, or property reference and our team will follow up directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#1E40AF] text-sm font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/properties"
              onClick={(e) => handleNav(e, '/properties')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/35 text-white text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <span>Browse Directory</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
