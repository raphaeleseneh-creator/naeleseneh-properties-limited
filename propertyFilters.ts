import type {
  AvailabilityStatus,
  DirectorySort,
  PriceBand,
  PropertyCategory,
  PropertyFilters,
  PropertyListing,
  TransactionType,
} from '../types/realEstate';

export const DEFAULT_PROPERTY_FILTERS: PropertyFilters = {
  query: '',
  transaction: 'all',
  category: 'all',
  location: 'all',
  priceBand: 'all',
  availability: 'all',
  sort: 'featured',
};

const VALID_TRANSACTIONS = new Set<string>(['sale', 'rent', 'lease']);
const VALID_CATEGORIES = new Set<string>(['land', 'residential', 'commercial']);
const VALID_PRICE_BANDS = new Set<string>([
  'all',
  'under-50m',
  '50m-150m',
  '150m-500m',
  'above-500m',
]);
const VALID_AVAILABILITIES = new Set<string>([
  'Available',
  'Under Offer',
  'Sold',
  'Rented',
  'Leased',
]);
const VALID_SORTS = new Set<string>(['featured', 'newest', 'price-asc', 'price-desc']);

export function parseFilterParams(search: string): PropertyFilters {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const transactionRaw = params.get('transaction') ?? '';
  const categoryRaw = params.get('category') ?? '';
  const priceBandRaw = params.get('price') ?? '';
  const availabilityRaw = params.get('availability') ?? '';
  const sortRaw = params.get('sort') ?? '';

  return {
    query: (params.get('q') ?? '').trim(),
    transaction: VALID_TRANSACTIONS.has(transactionRaw)
      ? (transactionRaw as TransactionType)
      : 'all',
    category: VALID_CATEGORIES.has(categoryRaw)
      ? (categoryRaw as PropertyCategory)
      : 'all',
    location: (params.get('location') ?? 'all').trim() || 'all',
    priceBand: VALID_PRICE_BANDS.has(priceBandRaw)
      ? (priceBandRaw as PriceBand)
      : 'all',
    availability: VALID_AVAILABILITIES.has(availabilityRaw)
      ? (availabilityRaw as AvailabilityStatus)
      : 'all',
    sort: VALID_SORTS.has(sortRaw) ? (sortRaw as DirectorySort) : 'featured',
  };
}

export function buildFilterSearchParams(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.transaction !== 'all') params.set('transaction', filters.transaction);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.location && filters.location !== 'all') params.set('location', filters.location);
  if (filters.priceBand !== 'all') params.set('price', filters.priceBand);
  if (filters.availability !== 'all') params.set('availability', filters.availability);
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export function matchesPriceBand(priceNumeric: number, band: PriceBand): boolean {
  switch (band) {
    case 'under-50m':
      return priceNumeric < 50_000_000;
    case '50m-150m':
      return priceNumeric >= 50_000_000 && priceNumeric <= 150_000_000;
    case '150m-500m':
      return priceNumeric > 150_000_000 && priceNumeric <= 500_000_000;
    case 'above-500m':
      return priceNumeric > 500_000_000;
    case 'all':
    default:
      return true;
  }
}

export function filterProperties(
  listings: PropertyListing[],
  filters: PropertyFilters,
  options: { includeUnpublished?: boolean } = {}
): PropertyListing[] {
  const includeUnpublished = options.includeUnpublished ?? false;
  const normalizedQuery = filters.query.trim().toLowerCase();
  const normalizedLocation = filters.location.trim().toLowerCase();

  const filtered = listings.filter((item) => {
    if (!includeUnpublished && !item.published) return false;
    if (filters.transaction !== 'all' && item.transactionType !== filters.transaction) {
      return false;
    }
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (
      normalizedLocation &&
      normalizedLocation !== 'all' &&
      !`${item.location.area} ${item.location.city} ${item.location.state}`
        .toLowerCase()
        .includes(normalizedLocation)
    ) {
      return false;
    }
    if (!matchesPriceBand(item.priceNumeric, filters.priceBand)) {
      return false;
    }
    if (filters.availability !== 'all' && item.availability !== filters.availability) {
      return false;
    }
    if (normalizedQuery) {
      const searchable = [
        item.title,
        item.referenceCode,
        item.summary,
        item.location.area,
        item.location.city,
        item.location.state,
        item.category,
        item.transactionType,
        item.specifications.titleDocument,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(normalizedQuery)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    if (filters.sort === 'price-asc') {
      return a.priceNumeric - b.priceNumeric;
    }
    if (filters.sort === 'price-desc') {
      return b.priceNumeric - a.priceNumeric;
    }
    if (filters.sort === 'newest') {
      return b.updatedAt.localeCompare(a.updatedAt);
    }
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return sorted;
}

export function formatTransactionLabel(transaction: TransactionType): string {
  if (transaction === 'sale') return 'For Sale';
  if (transaction === 'rent') return 'For Rent';
  return 'For Lease';
}

export function formatCategoryLabel(category: PropertyCategory): string {
  if (category === 'land') return 'Landed Property';
  if (category === 'residential') return 'Residential';
  return 'Commercial';
}

export interface ContactValidationInput {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(input: ContactValidationInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.name.trim()) {
    errors.name = 'Please enter your full name.';
  }
  if (!input.email.trim()) {
    errors.email = 'Please enter an email address.';
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.phone.trim() || input.phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'Please enter a valid phone number (at least 7 digits).';
  }
  if (!input.message.trim() || input.message.trim().length < 10) {
    errors.message = 'Please include a brief enquiry message (at least 10 characters).';
  }
  return errors;
}

export function validateNewsletterEmail(email: string): string | null {
  if (!email.trim()) return 'Please enter your email address.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Please enter a valid email address.';
  return null;
}

export function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}
