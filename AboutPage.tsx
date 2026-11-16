import React, { useEffect } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SmartImage } from '../components/SmartImage';
import { useAppState } from '../context/AppStateContext';
import { MEDIA_ASSETS } from '../data/media';

export const AboutPage: React.FC = () => {
  const { siteConfig, navigate, setPageMeta } = useAppState();

  useEffect(() => {
    setPageMeta({
      title: 'About Us | Naeleseneh Properties Limited',
      description:
        'Learn about Naeleseneh Properties Limited (Philo Eseneh & Co), our mission, vision, core values, and commitment to clients.',
    });
  }, [setPageMeta]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Intro Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
          <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
            About Us · {siteConfig.company.rcNumber}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            {siteConfig.company.legalName}
          </h1>
          <p className="text-base font-semibold text-[#1E40AF]">
            Trading as {siteConfig.company.tradingName}
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            Provisional company profile: Naeleseneh Properties Limited is a real estate company dedicated to buying, selling, renting, and leasing landed, residential, and commercial properties. We support individuals, families, landlords, and corporate investors at every stage of property transactions.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Note for launch: Replace this provisional background text with client-approved corporate history, leadership bio, and milestone copy in the page data module.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors cursor-pointer"
            >
              <span>Browse Properties</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              <span>Contact Our Team</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 min-h-[320px]">
          <SmartImage
            src={MEDIA_ASSETS.commercialTower}
            alt="Contemporary corporate and residential property portfolio backdrop"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 bg-white rounded-2xl p-7 sm:p-8">
          <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
            Our Mission (Provisional)
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Clear Guidance Through Every Property Decision
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            To connect buyers, tenants, landlords, and investors with suitable land and built properties through transparent communication, structured inspections, and diligent documentation support.
          </p>
        </div>

        <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-7 sm:p-8">
          <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
            Our Vision (Provisional)
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            A Trusted Standard in Landed &amp; Built Real Estate
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            To be recognized across our operating markets for reliable property representation, long-term client relationships, and well-documented transactions that stand the test of time.
          </p>
        </div>
      </section>

      {/* Core Values & Commitment */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
            Core Values &amp; Client Commitment
          </p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How We Work With Buyers, Landlords &amp; Investors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              num: '01',
              title: 'Transparency',
              body: 'Clear representation of property specifications, availability status, and transaction terms from initial enquiry to completion.',
            },
            {
              num: '02',
              title: 'Due Diligence',
              body: 'Encouraging survey verification, title checks, and physical site inspections prior to financial commitment.',
            },
            {
              num: '03',
              title: 'Responsiveness',
              body: 'Dedicated staff follow-up on property enquiries, inspection requests, and landlord onboarding.',
            },
            {
              num: '04',
              title: 'Stewardship',
              body: 'Respecting long-term client plans whether acquiring land for development, leasing workspace, or renting a residence.',
            },
          ].map((val) => (
            <div
              key={val.num}
              className="border border-slate-200 bg-white rounded-2xl p-6 space-y-3"
            >
              <span className="text-xs font-mono font-semibold text-[#1E40AF]">{val.num}.</span>
              <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{val.body}</p>
            </div>
          ))}
        </div>

        <div className="border border-blue-200/80 bg-[#EFF6FF]/60 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Registered Corporate Identity
            </h3>
            <p className="mt-1 text-sm text-slate-700 leading-relaxed">
              {siteConfig.company.legalName} ({siteConfig.company.tradingName}) · {siteConfig.company.rcNumber}. Unverified testimonials, historical milestones, and specific office credentials remain separated in configuration until final client approval.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
