import React, { useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import type { PriceBand, PropertyCategory, TransactionType } from '../types/realEstate';
import { buildFilterSearchParams, DEFAULT_PROPERTY_FILTERS } from '../utils/propertyFilters';

export const QuickSearchBar: React.FC = () => {
  const { listings, navigate } = useAppState();
  const baseId = useId();

  const [transaction, setTransaction] = useState<TransactionType | 'all'>('all');
  const [category, setCategory] = useState<PropertyCategory | 'all'>('all');
  const [location, setLocation] = useState<string>('all');
  const [priceBand, setPriceBand] = useState<PriceBand>('all');

  const locations = useMemo(() => {
    const areas = new Set<string>();
    listings
      .filter((l) => l.published)
      .forEach((l) => {
        areas.add(l.location.area);
      });
    return Array.from(areas).sort();
  }, [listings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = buildFilterSearchParams({
      ...DEFAULT_PROPERTY_FILTERS,
      transaction,
      category,
      location,
      priceBand,
    });
    navigate(`/properties${qs}`);
  };

  return (
    <section
      aria-label="Quick property search"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8"
    >
      <form
        onSubmit={handleSearch}
        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          <div className="lg:col-span-3">
            <label
              htmlFor={`${baseId}-transaction`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Transaction
            </label>
            <select
              id={`${baseId}-transaction`}
              value={transaction}
              onChange={(e) => setTransaction(e.target.value as TransactionType | 'all')}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">Buy, Rent, or Lease</option>
              <option value="sale">For Sale (Buy)</option>
              <option value="rent">For Rent</option>
              <option value="lease">For Lease</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label
              htmlFor={`${baseId}-category`}
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Property Type
            </label>
            <select
              id={`${baseId}-category`}
              value={category}
              onChange={(e) => setCategory(e.target.value as PropertyCategory | 'all')}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="land">Landed Properties</option>
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">All Locations</option>
              {locations.map((area) => (
                <option key={area} value={area}>
                  {area}
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
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value as PriceBand)}
              className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:border-[#1E40AF] focus:outline-none"
            >
              <option value="all">Any Budget</option>
              <option value="under-50m">Under ₦50M</option>
              <option value="50m-150m">₦50M – ₦150M</option>
              <option value="150m-500m">₦150M – ₦500M</option>
              <option value="above-500m">Above ₦500M</option>
            </select>
          </div>

          <div className="lg:col-span-2 sm:col-span-2">
            <button
              type="submit"
              className="w-full h-11 px-5 rounded-xl bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
