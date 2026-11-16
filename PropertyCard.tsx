import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import type { PropertyListing } from '../types/realEstate';
import { formatCategoryLabel, formatTransactionLabel } from '../utils/propertyFilters';
import { SmartImage } from './SmartImage';

interface PropertyCardProps {
  listing: PropertyListing;
  featuredLayout?: boolean;
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  listing,
  featuredLayout = false,
  priority = false,
}) => {
  const { navigate } = useAppState();
  const primaryPhoto = listing.photos[0];
  const detailHref = `/properties/${listing.slug}`;

  const availabilityColor =
    listing.availability === 'Available'
      ? 'text-[#1E40AF]'
      : listing.availability === 'Under Offer'
      ? 'text-amber-700'
      : 'text-slate-500';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(detailHref);
  };

  if (featuredLayout) {
    return (
      <article className="group border border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-12 transition-colors hover:border-[#1E40AF]/40">
        <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-auto lg:min-h-[340px] bg-slate-100 overflow-hidden">
          <a
            href={detailHref}
            onClick={handleClick}
            className="block w-full h-full focus-visible:outline-offset-[-4px]"
            aria-label={`View details for ${listing.title}`}
          >
            <SmartImage
              src={primaryPhoto?.url ?? ''}
              alt={primaryPhoto?.alt ?? listing.title}
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>
        </div>
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
              <span className="text-[#1E40AF] font-semibold">
                {formatTransactionLabel(listing.transactionType)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatCategoryLabel(listing.category)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{listing.referenceCode}</span>
              {listing.isSample && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Sample</span>
                </>
              )}
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
              <a
                href={detailHref}
                onClick={handleClick}
                className="hover:text-[#1E40AF] transition-colors"
              >
                {listing.title}
              </a>
            </h3>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-[#1E40AF] shrink-0" aria-hidden="true" />
              <span>
                {listing.location.area}, {listing.location.city}
              </span>
            </p>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
              {listing.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {listing.priceDisplay}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                {listing.priceCadence && <span>{listing.priceCadence}</span>}
                {listing.priceCadence && <span aria-hidden="true">·</span>}
                <span className={`font-semibold ${availabilityColor}`}>
                  {listing.availability}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{listing.specifications.landSize}</span>
              </div>
            </div>

            <a
              href={detailHref}
              onClick={handleClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View Property</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group border border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col transition-colors hover:border-[#1E40AF]/40">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <a
          href={detailHref}
          onClick={handleClick}
          className="block w-full h-full focus-visible:outline-offset-[-4px]"
          aria-label={`View details for ${listing.title}`}
        >
          <SmartImage
            src={primaryPhoto?.url ?? ''}
            alt={primaryPhoto?.alt ?? listing.title}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </a>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
            <span className="text-[#1E40AF] font-semibold">
              {formatTransactionLabel(listing.transactionType)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatCategoryLabel(listing.category)}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-semibold ${availabilityColor}`}>
              {listing.availability}
            </span>
          </div>

          <h3 className="mt-2.5 text-lg font-bold tracking-tight text-slate-900 leading-snug">
            <a
              href={detailHref}
              onClick={handleClick}
              className="hover:text-[#1E40AF] transition-colors"
            >
              {listing.title}
            </a>
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" aria-hidden="true" />
            <span>
              {listing.location.area}, {listing.location.city}
            </span>
          </p>

          <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-2">
            {listing.summary}
          </p>
        </div>

        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {listing.priceDisplay}
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              {listing.priceCadence ? `${listing.priceCadence} · ` : ''}
              {listing.specifications.landSize} · {listing.referenceCode}
            </div>
          </div>

          <a
            href={detailHref}
            onClick={handleClick}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-700 group-hover:border-[#1E40AF] group-hover:bg-[#1E40AF] group-hover:text-white transition-colors shrink-0"
            aria-label={`Open ${listing.title}`}
          >
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
