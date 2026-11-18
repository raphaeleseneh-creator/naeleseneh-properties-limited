import React, { useEffect, useId, useMemo } from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useAppState } from '../context/AppStateContext';
import type {
  AvailabilityStatus,
  DirectorySort,
  PriceBand,
  PropertyCategory,
  PropertyFilters,
  TransactionType,
} from '../types/realEstate';
import {
  DEFAULT_PROPERTY_FILTERS,
  buildFilterSearchParams,
  filterProperties,
  parseFilterParams,
} from '../utils/propertyFilters';

export const PropertiesPage: React.FC = () => {
  const { listings, search, navigate, setPageMeta } = useAppState();
  const baseId = useId();

  const filters = useMemo(() => parseFilterParams(search), [search]);

  useEffect(() => {
    let titleSuffix = 'Properties Directory';
    if (filters.category === 'land' && filters.transaction === 'all') {
      titleSuffix = 'Landed Properties';
    } else if (filters.transaction === 'sale') {
      titleSuffix = 'Properties for Sale';
    } else if (filters.transaction === 'rent') {
      titleSuffix = 'Properties for Rent';
    } else if (filters.transaction === 'lease') {
      titleSuffix = 'Properties for Lease';
    }

    setPageMeta({
      title: `${titleSuffix} | Naeleseneh Properties Limited`,
      description:
        'Search and filter landed, residential, and commercial properties for sale, rent, and lease.',
    });
  }, [filters.category, filters.transaction, setPageMeta]);

  const updateFilters = (patch: Partial<PropertyFilters>) => {
    const next: PropertyFilters = { ...filters, ...patch };
    const qs = buildFilterSearchParams(next);
    navigate(`/properties${qs}`, { scrollTop: false });
  };

  const resetAllFilters = () => {
    navigate('/properties', { scrollTop: false });
  };

  const publishedCount = useMemo(
    () => listings.filter((item) => item.published).length,
    [listings]
  );

  const filteredListings = useMemo(
    () => filterProperties(listings, filters),
    [listings, filters]
  );

  const availableLocations = useMemo(() => {
    const areas = new Set<string>();
    listings
      .filter((item) => item.published)
      .forEach((item) => areas.add(item.location.area));
    return Array.from(areas).sort();
  }, [listings]);

  const hasActiveFilters =
    filters.query !== '' ||
    filters.transaction !== 'all' ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.priceBand !== 'all' ||
    filters.availability !== 'all';

  const activeEntryKey =
    filters.category === 'land' && filters.transaction === 'all'
      ? 'land'
      : filters.transaction !== 'all' && filters.category === 'all'
      ? filters.transaction
      : filters.transaction === 'all' && filters.category === 'all'
      ? 'all'
      : 'custom';

  const selectEntryPoint = (entry: 'all' | 'sale' | 'rent' | 'lease' | 'land') => {
    if (entry === 'all') {
      updateFilters({ transaction: 'all', category: 'all' });
    } else if (entry === 'land') {
      updateFilters({ transaction: 'all', category: 'land' });
    } else {
      updateFilters({ transaction: entry, category: 'all' });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
          Property Directory · Sample Preview Listings
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Browse Properties &amp; Land
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Filter by transaction type, property category, location, price range, and availability. Land listings remain independently filterable across Sale, Rent, and Lease.
        </p>
      </div>

      {/* Entry-point directory tabs */}
      <div
        className="mt-7 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Directory entry points"
      >
        {(
          [
            { key: 'all', label: 'All Properties' },
            { key: 'sale', label: 'Sale' },
            { key: 'rent', label: 'Rent' },
            { key: 'lease', label: 'Lease' },
            { key: 'land', label: 'Landed Properties' },
          ] as const
        ).map((tab) => {
          const isActive = activeEntryKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectEntryPoint(tab.key)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Detailed Filter Panel */}
      <section
        aria-label="Property directory filters"
        className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          <div className="lg:col-span-3">
            <label
              htmlFor={`${baseId}-query`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Search Keyword or Ref
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id={`${baseId}-query`}
                type="search"
                value={filters.query}
                onChange={(e) => updateFilters({ query: e.target.value })}
                placeholder="e.g. Lekki, NPL-101, C of O"
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-none"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor={`${baseId}-transaction`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Transaction
            </label>
            <select
              id={`${baseId}-transaction`}
              value={filters.transaction}
              onChange={(e) =>
                updateFilters({ transaction: e.target.value as TransactionType | 'all' })
              }
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
              <option value="lease">Lease</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor={`${baseId}-category`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Category
            </label>
            <select
              id={`${baseId}-category`}
              value={filters.category}
              onChange={(e) =>
                updateFilters({ category: e.target.value as PropertyCategory | 'all' })
              }
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="land">Landed Property</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor={`${baseId}-location`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Location
            </label>
            <select
              id={`${baseId}-location`}
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor={`${baseId}-price`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Price Range
            </label>
            <select
              id={`${baseId}-price`}
              value={filters.priceBand}
              onChange={(e) => updateFilters({ priceBand: e.target.value as PriceBand })}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">Any Price</option>
              <option value="under-50m">Under ₦50M</option>
              <option value="50m-150m">₦50M – ₦150M</option>
              <option value="150m-500m">₦150M – ₦500M</option>
              <option value="above-500m">Above ₦500M</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <label
              htmlFor={`${baseId}-availability`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Status
            </label>
            <select
              id={`${baseId}-availability`}
              value={filters.availability}
              onChange={(e) =>
                updateFilters({
                  availability: e.target.value as AvailabilityStatus | 'all',
                })
              }
              className="w-full h-11 px-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">Any</option>
              <option value="Available">Available</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
              <option value="Leased">Leased</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900 tabular-nums">
              <SlidersHorizontal className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
              Showing {filteredListings.length} of {publishedCount} published listings
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor={`${baseId}-sort`} className="text-xs font-semibold text-slate-500">
                Sort
              </label>
              <select
                id={`${baseId}-sort`}
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value as DirectorySort })}
                className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#1E40AF] focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Recently Updated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid or Helpful Empty State */}
      {filteredListings.length > 0 ? (
        <div
          data-testid="directory-grid"
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredListings.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-slate-200 bg-slate-50/70 rounded-2xl p-10 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">
            No listings match your current filters
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Try clearing one or more filters—or reset all filters to view every published sample listing across Sale, Rent, Lease, and Landed Properties.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              Request Custom Sourcing
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
