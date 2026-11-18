import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { BrandLogo } from './BrandLogo';

export const SiteFooter: React.FC = () => {
  const { navigate, siteConfig } = useAppState();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          <div className="md:col-span-5 space-y-4">
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              className="inline-block"
              aria-label="Naeleseneh Properties Limited Home"
            >
              <BrandLogo variant="footer" inverted />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.company.legalName} ({siteConfig.company.tradingName}) facilitates the buying, selling, renting, and leasing of landed, residential, and commercial properties.
            </p>
            <p className="text-xs font-mono text-slate-400 tabular-nums">
              {siteConfig.company.legalName} · {siteConfig.company.rcNumber}
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
              Directory
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/properties"
                  onClick={(e) => handleNav(e, '/properties')}
                  className="hover:text-white transition-colors"
                >
                  All Properties
                </a>
              </li>
              <li>
                <a
                  href="/properties?transaction=sale"
                  onClick={(e) => handleNav(e, '/properties?transaction=sale')}
                  className="hover:text-white transition-colors"
                >
                  Properties for Sale
                </a>
              </li>
              <li>
                <a
                  href="/properties?transaction=rent"
                  onClick={(e) => handleNav(e, '/properties?transaction=rent')}
                  className="hover:text-white transition-colors"
                >
                  Properties for Rent
                </a>
              </li>
              <li>
                <a
                  href="/properties?transaction=lease"
                  onClick={(e) => handleNav(e, '/properties?transaction=lease')}
                  className="hover:text-white transition-colors"
                >
                  Properties for Lease
                </a>
              </li>
              <li>
                <a
                  href="/properties?category=land"
                  onClick={(e) => handleNav(e, '/properties?category=land')}
                  className="hover:text-white transition-colors"
                >
                  Landed Properties
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
              Company
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleNav(e, '/about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                  className="hover:text-white transition-colors"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  onClick={(e) => handleNav(e, '/news')}
                  className="hover:text-white transition-colors"
                >
                  News &amp; Insights
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleNav(e, '/faq')}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
              Enquiries &amp; Office
            </h2>
            <div className="space-y-2 text-sm text-slate-400">
              {siteConfig.contact.addressVerified ? (
                <p>
                  <a
                    href={siteConfig.contact.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="Locate Naeleseneh Properties office on Google Maps"
                  >
                    {siteConfig.contact.officeAddress}
                  </a>
                </p>
              ) : (
                <p>Office address awaiting verified client details.</p>
              )}
              {siteConfig.contact.phoneNumbers.map((phone) => (
                <p key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-slate-200 hover:text-white transition-colors tabular-nums"
                  >
                    {phone.display}
                  </a>
                </p>
              ))}
              {siteConfig.contact.emailVerified && siteConfig.contact.emailHref && (
                <p>
                  <a
                    href={siteConfig.contact.emailHref}
                    className="text-slate-200 hover:text-white transition-colors"
                  >
                    {siteConfig.contact.emailDisplay}
                  </a>
                </p>
              )}
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="/contact"
                onClick={(e) => handleNav(e, '/contact')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E40AF] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                <span>Make an Enquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.contact.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
                aria-label="Locate Naeleseneh Properties office on Google Maps"
              >
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Locate Us</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {siteConfig.company.legalName} ({siteConfig.company.tradingName}) · {siteConfig.company.rcNumber}. Frontend preview with sample listings.
          </p>
          <a
            href="/staff"
            onClick={(e) => handleNav(e, '/staff')}
            className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Staff Portal (Demo)
          </a>
        </div>
      </div>
    </footer>
  );
};
