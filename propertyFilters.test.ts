import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PROPERTY_FILTERS,
  buildFilterSearchParams,
  filterProperties,
  parseFilterParams,
  slugifyTitle,
  validateContactForm,
  validateNewsletterEmail,
} from './propertyFilters';
import type { PropertyListing } from '../types/realEstate';

const MOCK_LISTINGS: PropertyListing[] = [
  {
    id: '1',
    referenceCode: 'NPL-101',
    slug: 'serviced-plot-lekki',
    title: 'Serviced Residential Plot in Lekki Phase 1',
    summary: 'Dry fenced plot with C of O.',
    description: 'Detailed description',
    transactionType: 'sale',
    category: 'land',
    location: { area: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos State' },
    priceNumeric: 185_000_000,
    priceDisplay: '₦185,000,000',
    availability: 'Available',
    published: true,
    featured: true,
    specifications: { landSize: '650 sqm', titleDocument: 'Certificate of Occupancy' },
    features: ['Paved road'],
    photos: [{ id: 'p1', url: '/a.jpg', alt: 'Plot view' }],
    isSample: true,
    updatedAt: '2026-10-15',
  },
  {
    id: '2',
    referenceCode: 'NPL-102',
    slug: 'commercial-acreage-lease',
    title: 'Corner Commercial Land Parcel for Long Lease',
    summary: 'Ideal for logistics or showroom development.',
    description: 'Detailed description',
    transactionType: 'lease',
    category: 'land',
    location: { area: 'Ikeja', city: 'Lagos', state: 'Lagos State' },
    priceNumeric: 35_000_000,
    priceDisplay: '₦35,000,000',
    priceCadence: 'per annum',
    availability: 'Available',
    published: true,
    featured: false,
    specifications: { landSize: '2,400 sqm', titleDocument: 'Governor’s Consent' },
    features: ['Dual road frontage'],
    photos: [{ id: 'p2', url: '/b.jpg', alt: 'Commercial land' }],
    isSample: true,
    updatedAt: '2026-10-20',
  },
  {
    id: '3',
    referenceCode: 'NPL-103',
    slug: 'unpublished-draft-duplex',
    title: 'Draft Detached Duplex',
    summary: 'Draft listing not yet public.',
    description: 'Draft',
    transactionType: 'rent',
    category: 'residential',
    location: { area: 'Ikoyi', city: 'Lagos', state: 'Lagos State' },
    priceNumeric: 24_000_000,
    priceDisplay: '₦24,000,000',
    priceCadence: 'per annum',
    availability: 'Under Offer',
    published: false,
    featured: false,
    specifications: { landSize: '500 sqm', titleDocument: 'Deed of Assignment', bedrooms: 4 },
    features: ['Pool'],
    photos: [{ id: 'p3', url: '/c.jpg', alt: 'Duplex' }],
    isSample: true,
    updatedAt: '2026-10-25',
  },
];

test('transactionType and category are modeled separately so land appears under Sale, Lease, and Landed Properties', () => {
  const landOnly = filterProperties(MOCK_LISTINGS, {
    ...DEFAULT_PROPERTY_FILTERS,
    category: 'land',
  });
  assert.equal(landOnly.length, 2);

  const leaseLand = filterProperties(MOCK_LISTINGS, {
    ...DEFAULT_PROPERTY_FILTERS,
    transaction: 'lease',
    category: 'land',
  });
  assert.equal(leaseLand.length, 1);
  assert.equal(leaseLand[0].referenceCode, 'NPL-102');

  const saleLand = filterProperties(MOCK_LISTINGS, {
    ...DEFAULT_PROPERTY_FILTERS,
    transaction: 'sale',
    category: 'land',
  });
  assert.equal(saleLand.length, 1);
  assert.equal(saleLand[0].referenceCode, 'NPL-101');
});

test('unpublished listings are excluded from public directory unless includeUnpublished is true', () => {
  const publicList = filterProperties(MOCK_LISTINGS, DEFAULT_PROPERTY_FILTERS);
  assert.equal(publicList.length, 2);

  const staffList = filterProperties(MOCK_LISTINGS, DEFAULT_PROPERTY_FILTERS, {
    includeUnpublished: true,
  });
  assert.equal(staffList.length, 3);
});

test('URL search params serialize and parse cleanly for shareable filters and back button support', () => {
  const filters = {
    ...DEFAULT_PROPERTY_FILTERS,
    query: 'Lekki',
    transaction: 'sale' as const,
    category: 'land' as const,
    location: 'Lekki Phase 1',
    priceBand: '150m-500m' as const,
    sort: 'price-asc' as const,
  };
  const queryString = buildFilterSearchParams(filters);
  const parsed = parseFilterParams(queryString);
  assert.deepEqual(parsed, filters);
});

test('price band and location filters narrow results accurately', () => {
  const highEnd = filterProperties(MOCK_LISTINGS, {
    ...DEFAULT_PROPERTY_FILTERS,
    priceBand: '150m-500m',
  });
  assert.equal(highEnd.length, 1);
  assert.equal(highEnd[0].id, '1');

  const ikeja = filterProperties(MOCK_LISTINGS, {
    ...DEFAULT_PROPERTY_FILTERS,
    location: 'Ikeja',
  });
  assert.equal(ikeja.length, 1);
  assert.equal(ikeja[0].id, '2');
});

test('contact form and newsletter validation reject invalid inputs and accept valid inputs', () => {
  const badErrors = validateContactForm({
    name: '',
    email: 'not-an-email',
    phone: '123',
    message: 'Hi',
  });
  assert.ok(badErrors.name);
  assert.ok(badErrors.email);
  assert.ok(badErrors.phone);
  assert.ok(badErrors.message);

  const goodErrors = validateContactForm({
    name: 'Amaka Okafor',
    email: 'amaka@example.com',
    phone: '+234 800 000 0000',
    message: 'I would like to schedule a site inspection for NPL-101.',
  });
  assert.deepEqual(goodErrors, {});

  assert.ok(validateNewsletterEmail('invalid'));
  assert.equal(validateNewsletterEmail('client@example.com'), null);
});

test('slugifyTitle creates clean URL slugs', () => {
  assert.equal(
    slugifyTitle('Serviced Corner Plot — Lekki Phase 1!'),
    'serviced-corner-plot-lekki-phase-1'
  );
});
