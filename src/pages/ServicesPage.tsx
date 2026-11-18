import React, { useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Building2, Compass, KeyRound, Landmark } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

export const ServicesPage: React.FC = () => {
  const { siteConfig, navigate, setPageMeta } = useAppState();

  useEffect(() => {
    setPageMeta({
      title: 'Our Services | Naeleseneh Properties Limited',
      description:
        'Buying and selling landed properties, residential and commercial rentals, and structured property leasing.',
    });
  }, [setPageMeta]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
          Our Services · {siteConfig.company.tradingName}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Real Estate Services Built Around Your Goals
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          {siteConfig.company.legalName} supports buyers, sellers, tenants, landlords, and institutional investors across three core transaction pillars.
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="border border-slate-200 bg-white rounded-2xl p-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1E40AF] inline-flex items-center justify-center">
              <Landmark className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              01. Buying &amp; Selling Landed Properties
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We facilitate the purchase and sale of serviced estate plots, commercial acreage, and developed residential or commercial properties. Our workflow prioritizes guided physical inspections and clear documentation review.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 pt-2">
              <li>· Residential &amp; commercial land parcels</li>
              <li>· Completed detached and multi-unit properties</li>
              <li>· Seller representation &amp; buyer inspection coordination</li>
            </ul>
          </div>
          <a
            href="/properties?transaction=sale"
            onClick={(e) => handleNav(e, '/properties?transaction=sale')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E40AF] hover:underline"
          >
            <span>Explore Properties for Sale</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </article>

        <article className="border border-slate-200 bg-white rounded-2xl p-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1E40AF] inline-flex items-center justify-center">
              <KeyRound className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              02. Residential &amp; Commercial Rentals
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connecting prospective tenants with vetted apartments, family residences, retail showrooms, and holding spaces while supporting landlords with structured tenant enquiries.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 pt-2">
              <li>· Serviced apartments &amp; private residences</li>
              <li>· Retail &amp; showroom spaces</li>
              <li>· Transparent annual rental terms &amp; guided viewings</li>
            </ul>
          </div>
          <a
            href="/properties?transaction=rent"
            onClick={(e) => handleNav(e, '/properties?transaction=rent')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E40AF] hover:underline"
          >
            <span>Explore Rental Listings</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </article>

        <article className="border border-slate-200 bg-white rounded-2xl p-7 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1E40AF] inline-flex items-center justify-center">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              03. Structured Property &amp; Land Leasing
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tailored multi-year commercial office leases and long-term ground leases for businesses seeking strategic locations without immediate capital acquisition.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 pt-2">
              <li>· Corporate office suites &amp; full floors</li>
              <li>· Commercial land ground leases</li>
              <li>· Multi-year lease terms &amp; renewal coordination</li>
            </ul>
          </div>
          <a
            href="/properties?transaction=lease"
            onClick={(e) => handleNav(e, '/properties?transaction=lease')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E40AF] hover:underline"
          >
            <span>Explore Lease Listings</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </article>
      </section>

      {/* Configurable Sourcing & Advisory Consultancy Section */}
      {siteConfig.services.showSourcingAndConsultancy ? (
        <section className="border border-blue-200 bg-[#EFF6FF]/60 rounded-2xl p-7 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Advisory &amp; Custom Sourcing</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                04. Bespoke Property Sourcing &amp; Real Estate Consultancy
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                For clients with specific location, acreage, or portfolio mandates, our advisory desk conducts targeted off-market sourcing, comparative corridor briefings, and structured transaction coordination.
              </p>
            </div>
            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Discuss a Mandate</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : (
        <section className="border border-dashed border-slate-300 bg-slate-50/70 rounded-2xl p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">
            Configurable Section: Property Sourcing &amp; Consultancy
          </p>
          <p className="mt-1">
            Currently hidden from public visitors until client confirmation. Administrators can enable{' '}
            <code className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200">
              services.showSourcingAndConsultancy
            </code>{' '}
            in site configuration or preview it from the Staff Portal Configuration tab.
          </p>
        </section>
      )}

      <section className="border-t border-slate-200 pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Ready to list a property or request a viewing?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Reach out via our enquiry form and our team will follow up directly.
          </p>
        </div>
        <a
          href="/contact"
          onClick={(e) => handleNav(e, '/contact')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap shrink-0"
        >
          <span>Contact Us</span>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
};
