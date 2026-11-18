import React, { useEffect, useMemo } from 'react';
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
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
  const whatsappMessage = encodeURIComponent(
    'Hello Naeleseneh Properties Limited, I would like to make a property enquiry.'
  );

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
            <p className="text-sm text-slate-600">
              Call, email, or start a WhatsApp conversation with our property team.
            </p>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-slate-900">Telephone</div>
                  <div className="mt-1 flex flex-col items-start gap-1">
                    {contact.phoneNumbers.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="text-[#1E40AF] hover:underline font-medium tabular-nums"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <div className="min-w-0">
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
                  {contact.addressVerified ? (
                    <a
                      href={contact.mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-start gap-1.5 font-medium text-[#1E40AF] hover:underline"
                      aria-label="Locate Naeleseneh Properties office on Google Maps"
                    >
                      <span>{contact.officeAddress}</span>
                      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-slate-500">{contact.officeAddress}</span>
                  )}
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {contact.phoneNumbers.map((phone) => (
                      <a
                        key={phone.whatsappNumber}
                        href={`https://wa.me/${phone.whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackAnalyticsEvent('whatsapp_click', { sourcePage: '/contact' })
                        }
                        aria-label={`Chat with Naeleseneh Properties on WhatsApp using ${phone.display}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#16A34A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#15803D]"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span>{phone.display}</span>
                      </a>
                    ))}
                  </div>
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Visit Our Office</h2>
                <p className="mt-1 text-sm text-slate-600">{contact.officeAddress}</p>
              </div>
              <a
                href={contact.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-[#1E40AF] hover:text-[#1E40AF]"
              >
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Locate Us</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            {contact.mapEmbedVerified && contact.mapEmbedUrl ? (
              <div className="mt-4 aspect-[4/3] rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title="Map showing Naeleseneh Properties office at F74, Road 2, Ikota Shopping Complex"
                  src={contact.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
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
