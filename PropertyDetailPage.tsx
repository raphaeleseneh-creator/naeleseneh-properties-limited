import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageSquare,
  PlayCircle,
  Share2,
} from 'lucide-react';
import { EnquiryForm, type EnquiryFormMode } from '../components/EnquiryForm';
import { SmartImage } from '../components/SmartImage';
import { useAppState } from '../context/AppStateContext';
import { trackAnalyticsEvent } from '../lib/analytics';
import { formatCategoryLabel, formatTransactionLabel } from '../utils/propertyFilters';

interface PropertyDetailPageProps {
  slug: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ slug }) => {
  const { listings, navigate, setPageMeta } = useAppState();
  const formSectionRef = useRef<HTMLElement | null>(null);

  const listing = useMemo(
    () => listings.find((item) => item.slug === slug || item.id === slug),
    [listings, slug]
  );

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [formMode, setFormMode] = useState<EnquiryFormMode>('Property Enquiry');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  useEffect(() => {
    setActivePhotoIndex(0);
    if (listing) {
      setPageMeta({
        title: `${listing.title} (${listing.referenceCode}) | Naeleseneh Properties Limited`,
        description: listing.summary,
      });
      trackAnalyticsEvent('property_view', {
        propertyRef: listing.referenceCode,
        propertyTitle: listing.title,
        transactionType: listing.transactionType,
        category: listing.category,
        sourcePage: `/properties/${listing.slug}`,
      });
    } else {
      setPageMeta({
        title: 'Property Not Found | Naeleseneh Properties Limited',
        description: 'The requested property listing could not be found.',
      });
    }
  }, [listing, setPageMeta]);

  if (!listing) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Property Listing Not Found</h1>
        <p className="mt-3 text-slate-600">
          This listing may have been removed or its URL may have changed in the current session.
        </p>
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="mt-6 px-6 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors cursor-pointer"
        >
          Return to Property Directory
        </button>
      </main>
    );
  }

  const photos = listing.photos.length > 0
    ? listing.photos
    : [{ id: 'fallback', url: '', alt: listing.title, caption: 'No image supplied' }];
  const safeIndex = Math.min(activePhotoIndex, photos.length - 1);
  const activePhoto = photos[safeIndex];

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const openActionForm = (mode: EnquiryFormMode) => {
    setFormMode(mode);
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleCopyShareLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    } catch {
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb / Back navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#1E40AF] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Properties</span>
        </button>

        <button
          type="button"
          onClick={handleCopyShareLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors cursor-pointer"
        >
          {copiedShareLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
              <span>Share link copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copy shareable URL</span>
            </>
          )}
        </button>
      </div>

      {/* Main Split Header & Photo Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Photo Gallery + Optional Video */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            <SmartImage
              src={activePhoto.url}
              alt={activePhoto.alt}
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="w-full h-full object-cover"
            />

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  aria-label="Previous property photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-900 hover:bg-white shadow-sm inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  aria-label="Next property photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-slate-900 hover:bg-white shadow-sm inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-slate-950/75 text-white text-xs font-medium tabular-nums">
              {safeIndex + 1} / {photos.length}
            </div>
          </div>

          {activePhoto.caption && (
            <p className="text-xs text-slate-500">{activePhoto.caption}</p>
          )}

          {photos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {photos.map((photo, index) => {
                const selected = index === safeIndex;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhotoIndex(index)}
                    aria-label={`View photo ${index + 1}: ${photo.alt}`}
                    aria-pressed={selected}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selected
                        ? 'border-[#1E40AF] ring-2 ring-[#1E40AF]/20'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SmartImage
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {listing.videoUrl && (
            <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-slate-50/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PlayCircle className="w-5 h-5 text-[#1E40AF] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Property Video Link</p>
                  <p className="text-xs text-slate-600 break-all">{listing.videoUrl}</p>
                </div>
              </div>
              <a
                href={listing.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:border-[#1E40AF] hover:text-[#1E40AF] whitespace-nowrap shrink-0"
              >
                Open Video
              </a>
            </div>
          )}
        </div>

        {/* Right: Summary, Pricing, Specifications & Primary Actions */}
        <div className="lg:col-span-5 border border-slate-200 bg-white rounded-2xl p-6 sm:p-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
              <span className="text-[#1E40AF]">
                {formatTransactionLabel(listing.transactionType)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatCategoryLabel(listing.category)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{listing.referenceCode}</span>
              {listing.isSample && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Sample Preview</span>
                </>
              )}
            </div>

            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {listing.title}
            </h1>

            <p className="mt-2.5 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-[#1E40AF] shrink-0" aria-hidden="true" />
              <span>
                {listing.location.area}, {listing.location.city}, {listing.location.state}
              </span>
            </p>
          </div>

          <div className="py-4 border-y border-slate-100 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {listing.priceDisplay}
              </div>
              {listing.priceCadence && (
                <div className="text-xs font-medium text-slate-500">{listing.priceCadence}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Availability</div>
              <div
                className={`text-sm font-bold ${
                  listing.availability === 'Available'
                    ? 'text-[#1E40AF]'
                    : listing.availability === 'Under Offer'
                    ? 'text-amber-700'
                    : 'text-slate-600'
                }`}
              >
                {listing.availability}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openActionForm('Property Enquiry')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>Enquire Now</span>
            </button>
            <button
              type="button"
              onClick={() => openActionForm('Inspection Request')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#1E40AF] bg-white text-[#1E40AF] text-sm font-semibold hover:bg-[#EFF6FF] transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" aria-hidden="true" />
              <span>Schedule an Inspection</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Selecting <strong>Schedule an Inspection</strong> opens the request form with reference{' '}
            <span className="font-mono font-semibold text-slate-700">{listing.referenceCode}</span>{' '}
            pre-filled. A staff representative will follow up to confirm an appointment.
          </p>

          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">Key Specifications</h2>
            <dl className="divide-y divide-slate-100 text-sm">
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-slate-500">Land / Area Size</dt>
                <dd className="font-semibold text-slate-900 tabular-nums text-right">
                  {listing.specifications.landSize}
                </dd>
              </div>
              <div className="py-2 flex justify-between gap-4">
                <dt className="text-slate-500">Title / Documentation</dt>
                <dd className="font-semibold text-slate-900 text-right">
                  {listing.specifications.titleDocument}
                </dd>
              </div>
              {listing.specifications.zoning && (
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Zoning / Use</dt>
                  <dd className="font-semibold text-slate-900 text-right">
                    {listing.specifications.zoning}
                  </dd>
                </div>
              )}
              {typeof listing.specifications.bedrooms === 'number' && (
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Bedrooms</dt>
                  <dd className="font-semibold text-slate-900 tabular-nums">
                    {listing.specifications.bedrooms}
                  </dd>
                </div>
              )}
              {typeof listing.specifications.bathrooms === 'number' && (
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Bathrooms</dt>
                  <dd className="font-semibold text-slate-900 tabular-nums">
                    {listing.specifications.bathrooms}
                  </dd>
                </div>
              )}
              {typeof listing.specifications.parkingSpaces === 'number' && (
                <div className="py-2 flex justify-between gap-4">
                  <dt className="text-slate-500">Parking Spaces</dt>
                  <dd className="font-semibold text-slate-900 tabular-nums">
                    {listing.specifications.parkingSpaces}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Description, Features & Optional Map */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <section className="border border-slate-200 bg-white rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Property Overview</h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">{listing.description}</p>

            {listing.features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Notable Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700">
                  {listing.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check
                        className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="border border-slate-200 bg-white rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Location &amp; Map</h2>
            <p className="mt-2 text-sm text-slate-600">
              {listing.location.area}, {listing.location.city}, {listing.location.state}
              {listing.location.addressNote ? ` — ${listing.location.addressNote}` : ''}
            </p>
            {listing.mapConfig?.approved && listing.mapConfig.embedUrl ? (
              <div className="mt-4 aspect-[16/9] rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title={`Map for ${listing.title}`}
                  src={listing.mapConfig.embedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm text-slate-600">
                Interactive map embed displays here once an approved location coordinate or Google Maps URL is configured for this property.
              </div>
            )}
          </section>
        </div>

        {/* Right: Carried Reference Enquiry & Inspection Form */}
        <section
          ref={formSectionRef}
          id="property-action-form"
          aria-label="Property enquiry and inspection request"
          className="lg:col-span-5"
        >
          <EnquiryForm
            mode={formMode}
            onModeChange={setFormMode}
            propertyRef={listing.referenceCode}
            propertyTitle={listing.title}
            sourcePage={`/properties/${listing.slug}`}
          />
        </section>
      </div>
    </main>
  );
};
