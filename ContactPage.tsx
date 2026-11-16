import React, { useEffect, useMemo } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { EnquiryForm } from '../components/EnquiryForm';
import { useAppState } from '../context/AppStateContext';
import { trackAnalyticsEvent } from '../lib/analytics';

export const ContactPage: React.FC = () => {
  const { siteConfig, search, setPageMeta } = useAppState();

  const initialRef = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('ref') ?? '';
  }, [search]);

  useEffect(() => {
    setPageMeta({
      title: 'Contact Us | Naeleseneh Properties Limited',
      description:
        'Send a property enquiry, request a site inspection, or reach Naeleseneh Properties Limited (Philo Eseneh & Co).',
    });
  }, [setPageMeta]);

  const { contact } = siteConfig;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-3xl mb-10">
        <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
          Contact Us · {siteConfig.company.legalName}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Get in Touch With Our Property Team
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Have a question about buying land, renting a residence, leasing commercial space, or listing your property? Send an enquiry below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Enquiry Form */}
        <div className="lg:col-span-7">
          <EnquiryForm
            mode={initialRef ? 'Property Enquiry' : 'General Enquiry'}
            propertyRef={initialRef}
            sourcePage="/contact"
          />
        </div>

        {/* Right: Configurable Official Channels & Map */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="border border-slate-200 bg-white rounded-2xl p-6 sm:p-7 space-y-5">
            <h2 className="text-lg font-bold text-slate-900">
              Official Contact Channels
            </h2>
            <p className="text-xs text-slate-500">
              Contact links become interactive automatically once verified numbers, email, and office address are configured in{' '}
              <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">siteConfig.ts</code>.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">Telephone</div>
                  {contact.phoneVerified && contact.phoneHref ? (
                    <a
                      href={contact.phoneHref}
                      className="text-[#1E40AF] hover:underline font-medium"
                    >
                      {contact.phoneDisplay}
                    </a>
                  ) : (
                    <span className="text-slate-500">{contact.phoneDisplay}</span>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">Email</div>
                  {contact.emailVerified && contact.emailHref ? (
                    <a
                      href={contact.emailHref}
                      className="text-[#1E40AF] hover:underline font-medium"
                    >
                      {contact.emailDisplay}
                    </a>
                  ) : (
                    <span className="text-slate-500">{contact.emailDisplay}</span>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">Office Address</div>
                  <span className={contact.addressVerified ? 'text-slate-700' : 'text-slate-500'}>
                    {contact.officeAddress}
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">Office Hours</div>
                  <span className="text-slate-600">{contact.officeHours}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MessageCircle className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">WhatsApp Desk</div>
                  {contact.whatsappVerified && contact.whatsappNumber ? (
                    <a
                      href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackAnalyticsEvent('whatsapp_click', { sourcePage: '/contact' })
                      }
                      className="inline-flex items-center gap-1.5 mt-1 px-4 py-2 rounded-full bg-[#1E40AF] text-white text-xs font-semibold hover:bg-[#17358F] transition-colors"
                    >
                      <span>Chat on WhatsApp</span>
                    </a>
                  ) : (
                    <span className="text-slate-500">{contact.whatsappLabel}</span>
                  )}
                </div>
              </li>
            </ul>

            {contact.socialLinks.some((s) => s.verified && s.url) && (
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-2">Social Channels</div>
                <div className="flex flex-wrap gap-3">
                  {contact.socialLinks
                    .filter((s) => s.verified && s.url)
                    .map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#1E40AF] hover:underline"
                      >
                        {s.label}
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl p-6">
            <h2 className="text-base font-bold text-slate-900">Office Location Map</h2>
            {contact.mapEmbedVerified && contact.mapEmbedUrl ? (
              <div className="mt-3 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title="Naeleseneh Properties Office Map"
                  src={contact.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-xs sm:text-sm text-slate-600">
                Google Maps embed activates here once the verified office address and Maps embed URL are supplied.
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
};
