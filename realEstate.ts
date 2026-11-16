export type TransactionType = 'sale' | 'rent' | 'lease';

export type PropertyCategory = 'land' | 'residential' | 'commercial';

export type AvailabilityStatus =
  | 'Available'
  | 'Under Offer'
  | 'Sold'
  | 'Rented'
  | 'Leased';

export interface PropertyPhoto {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface PropertySpecifications {
  landSize: string;
  titleDocument: string;
  zoning?: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  yearBuilt?: string;
}

export interface PropertyLocation {
  area: string;
  city: string;
  state: string;
  addressNote?: string;
}

export interface PropertyListing {
  id: string;
  referenceCode: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  transactionType: TransactionType;
  category: PropertyCategory;
  location: PropertyLocation;
  priceNumeric: number;
  priceDisplay: string;
  priceCadence?: string;
  availability: AvailabilityStatus;
  published: boolean;
  featured: boolean;
  specifications: PropertySpecifications;
  features: string[];
  photos: PropertyPhoto[];
  videoUrl?: string;
  mapConfig?: {
    approved: boolean;
    embedUrl?: string;
    label?: string;
  };
  isSample: boolean;
  updatedAt: string;
}

export type PriceBand =
  | 'all'
  | 'under-50m'
  | '50m-150m'
  | '150m-500m'
  | 'above-500m';

export type DirectorySort = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface PropertyFilters {
  query: string;
  transaction: TransactionType | 'all';
  category: PropertyCategory | 'all';
  location: string;
  priceBand: PriceBand;
  availability: AvailabilityStatus | 'all';
  sort: DirectorySort;
}

export type ArticleCategory = 'Property Updates' | 'Investment Tips' | 'Industry News';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: ArticleCategory;
  publishedAt: string;
  readTime: string;
  author: string;
  coverUrl: string;
  coverAlt: string;
  published: boolean;
  isSample: boolean;
}

export interface FaqItem {
  id: string;
  topic: 'Purchases' | 'Rentals' | 'Leasing' | 'Inspections' | 'Company Services';
  question: string;
  answer: string;
  isProvisional?: boolean;
}

export interface EnquiryItem {
  id: string;
  type: 'General Enquiry' | 'Property Enquiry' | 'Inspection Request';
  name: string;
  email: string;
  phone: string;
  propertyRef?: string;
  propertyTitle?: string;
  preferredWindow?: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Reviewed' | 'Inspection Scheduled';
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  roleOrContext: string;
  quote: string;
  approved: boolean;
}
