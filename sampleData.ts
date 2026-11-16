import { MEDIA_ASSETS } from './media';
import type {
  EnquiryItem,
  FaqItem,
  NewsArticle,
  PropertyListing,
  TestimonialItem,
} from '../types/realEstate';

export const SAMPLE_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-1',
    referenceCode: 'NPL-101',
    slug: 'serviced-corner-plot-lekki-phase-1',
    title: 'Serviced Corner Residential Plot, Lekki Phase 1',
    summary:
      'Dry, sand-filled corner parcel in a gated residential corridor with paved access and verifiable title documentation.',
    description:
      'Sample Listing — Positioned along a quiet, fully paved residential avenue in Lekki Phase 1, this 820 sqm corner parcel is dry, fenced, and ready for immediate residential or boutique multi-unit development. The surrounding neighbourhood features underground drainage, perimeter security, and reliable municipal road connectivity.',
    transactionType: 'sale',
    category: 'land',
    location: {
      area: 'Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
      addressNote: 'Exact street number provided upon verified inspection booking.',
    },
    priceNumeric: 245_000_000,
    priceDisplay: '₦245,000,000',
    availability: 'Available',
    published: true,
    featured: true,
    specifications: {
      landSize: '820 sqm',
      titleDocument: 'Certificate of Occupancy (Sample)',
      zoning: 'Residential / Low-Density Multi-Family',
    },
    features: [
      'Dual road corner frontage',
      'Paved asphalt estate road & covered drainage',
      'Dry elevated terrain with perimeter block wall',
      'Survey plan & title verification ready for due diligence',
    ],
    photos: [
      {
        id: 'p-101-a',
        url: MEDIA_ASSETS.landedEstatePlot,
        alt: 'Cleared corner residential land parcel alongside a paved estate road',
        caption: 'Primary frontage along paved access road (Sample preview photo)',
      },
      {
        id: 'p-101-b',
        url: MEDIA_ASSETS.detachedDuplex,
        alt: 'Neighbouring completed detached residence on adjoining street',
        caption: 'Surrounding residential development character',
      },
    ],
    videoUrl: '',
    mapConfig: {
      approved: false,
      label: 'Lekki Phase 1 corridor (Map pin activates when approved coordinates are supplied)',
    },
    isSample: true,
    updatedAt: '2026-11-08',
  },
  {
    id: 'prop-2',
    referenceCode: 'NPL-102',
    slug: 'contemporary-five-bedroom-detached-residence-ikoyi',
    title: 'Contemporary 5-Bedroom Detached Residence, Old Ikoyi',
    summary:
      'Sunlit detached home with stone-clad facade, private carport, landscaped lawn, and generous indoor-outdoor living.',
    description:
      'Sample Listing — Designed for privacy and natural light, this five-bedroom detached residence blends clean architectural lines with warm natural stone finishes. The ground level opens onto a landscaped lawn and interlocking courtyard, while the upper floor offers broad glass balconies and en-suite family bedrooms.',
    transactionType: 'sale',
    category: 'residential',
    location: {
      area: 'Old Ikoyi',
      city: 'Lagos',
      state: 'Lagos State',
      addressNote: 'Private viewings coordinated directly through our advisory team.',
    },
    priceNumeric: 680_000_000,
    priceDisplay: '₦680,000,000',
    availability: 'Available',
    published: true,
    featured: true,
    specifications: {
      landSize: '640 sqm',
      titleDocument: 'Federal Certificate of Occupancy (Sample)',
      bedrooms: 5,
      bathrooms: 6,
      parkingSpaces: 4,
      yearBuilt: '2025',
    },
    features: [
      'En-suite primary suite with wrap-around balcony',
      'Fitted contemporary kitchen & pantry',
      'Covered twin timber carport & gated driveway',
      'Dedicated staff quarters & security gatehouse',
    ],
    photos: [
      {
        id: 'p-102-a',
        url: MEDIA_ASSETS.detachedDuplex,
        alt: 'Contemporary detached five-bedroom residence with stone facade and manicured lawn',
        caption: 'Front elevation and interlocking driveway (Sample preview photo)',
      },
      {
        id: 'p-102-b',
        url: MEDIA_ASSETS.heroResidence,
        alt: 'Sunlit glass living terrace and poolside architectural view',
        caption: 'Rear terrace perspective (Sample preview photo)',
      },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=sample-tour',
    mapConfig: {
      approved: false,
      label: 'Old Ikoyi residential district',
    },
    isSample: true,
    updatedAt: '2026-11-10',
  },
  {
    id: 'prop-3',
    referenceCode: 'NPL-103',
    slug: 'executive-three-bedroom-apartments-victoria-island',
    title: 'Executive 3-Bedroom Residences for Rent, Victoria Island',
    summary:
      'Mid-rise serviced apartments with glass balconies, landscaped courtyard palms, and 24-hour facility management.',
    description:
      'Sample Listing — Offering convenient access to Victoria Island’s business districts, these three-bedroom apartments feature floor-to-ceiling glazing, timber-lined balcony soffits, and generous open-plan living spaces suited to corporate tenants and families.',
    transactionType: 'rent',
    category: 'residential',
    location: {
      area: 'Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
    },
    priceNumeric: 28_000_000,
    priceDisplay: '₦28,000,000',
    priceCadence: 'per annum',
    availability: 'Available',
    published: true,
    featured: true,
    specifications: {
      landSize: '2,200 sqm complex',
      titleDocument: 'Residential Tenancy Agreement (Sample)',
      bedrooms: 3,
      bathrooms: 4,
      parkingSpaces: 2,
      yearBuilt: '2024',
    },
    features: [
      'Private glass-railed terrace overlooking courtyard',
      '24-hour estate security & backup power infrastructure',
      'Dedicated elevator lobby and covered resident parking',
      'On-site facility management office',
    ],
    photos: [
      {
        id: 'p-103-a',
        url: MEDIA_ASSETS.waterfrontApartments,
        alt: 'Modern mid-rise residential apartment building with timber soffits and landscaped palms',
        caption: 'Exterior courtyard elevation (Sample preview photo)',
      },
      {
        id: 'p-103-b',
        url: MEDIA_ASSETS.heroResidence,
        alt: 'Contemporary sunlit interior and glass balcony lounge',
        caption: 'Living room terrace ambience (Sample preview photo)',
      },
    ],
    isSample: true,
    updatedAt: '2026-11-06',
  },
  {
    id: 'prop-4',
    referenceCode: 'NPL-104',
    slug: 'grade-a-commercial-floor-victoria-island-lease',
    title: 'Grade-A Commercial Office Suite for Lease, Victoria Island',
    summary:
      'Full-floor corporate workspace with blue curtain-wall glazing, reception concierge, and multi-year lease flexibility.',
    description:
      'Sample Listing — Occupying a prime corner of a modern corporate plaza, this open-plan commercial floor offers abundant natural daylight, raised access flooring, and structured lease terms tailored for financial, legal, and technology firms.',
    transactionType: 'lease',
    category: 'commercial',
    location: {
      area: 'Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
    },
    priceNumeric: 65_000_000,
    priceDisplay: '₦65,000,000',
    priceCadence: 'per annum',
    availability: 'Available',
    published: true,
    featured: false,
    specifications: {
      landSize: '520 sqm lettable floor',
      titleDocument: 'Commercial Lease Agreement (Sample)',
      zoning: 'Commercial Grade-A Office',
      parkingSpaces: 8,
      yearBuilt: '2024',
    },
    features: [
      'Curtain-wall acoustic glazing & white architectural fins',
      'Dedicated passenger & service elevators',
      'Street-level landscaped reception plaza',
      'Flexible 3-to-5-year corporate lease terms',
    ],
    photos: [
      {
        id: 'p-104-a',
        url: MEDIA_ASSETS.commercialTower,
        alt: 'Modern royal-blue glass commercial office building in warm sunlight',
        caption: 'Corporate plaza frontage (Sample preview photo)',
      },
      {
        id: 'p-104-b',
        url: MEDIA_ASSETS.waterfrontApartments,
        alt: 'Landscaped pedestrian entrance courtyard',
        caption: 'Street-level pedestrian plaza',
      },
    ],
    isSample: true,
    updatedAt: '2026-11-05',
  },
  {
    id: 'prop-5',
    referenceCode: 'NPL-105',
    slug: 'commercial-acreage-long-lease-ikeja',
    title: 'Fenced Commercial Land Parcel for Long Lease, Ikeja',
    summary:
      '2,400 sqm level corner land along a major commercial corridor, suited to logistics, showroom, or modular retail.',
    description:
      'Sample Listing — Strategically positioned for businesses requiring high visibility without full capital acquisition, this cleared 2,400 sqm landed property is available on a structured 10-to-15-year commercial ground lease.',
    transactionType: 'lease',
    category: 'land',
    location: {
      area: 'Ikeja',
      city: 'Lagos',
      state: 'Lagos State',
    },
    priceNumeric: 38_000_000,
    priceDisplay: '₦38,000,000',
    priceCadence: 'per annum',
    availability: 'Available',
    published: true,
    featured: false,
    specifications: {
      landSize: '2,400 sqm',
      titleDocument: 'Governor’s Consent / Ground Lease (Sample)',
      zoning: 'Commercial / Light Logistics',
    },
    features: [
      'Heavy-duty paved access road',
      'Full perimeter fencing and wide gated entry',
      'Level cleared ground ready for temporary or permanent structures',
      'Long-term corporate ground lease option',
    ],
    photos: [
      {
        id: 'p-105-a',
        url: MEDIA_ASSETS.landedEstatePlot,
        alt: 'Wide cleared commercial land parcel bordered by white perimeter fence and paved road',
        caption: 'Cleared level land parcel (Sample preview photo)',
      },
    ],
    isSample: true,
    updatedAt: '2026-11-03',
  },
  {
    id: 'prop-6',
    referenceCode: 'NPL-106',
    slug: 'maitama-ambassadorial-villa-sale-abuja',
    title: 'Contemporary Architectural Villa, Maitama District',
    summary:
      'Expansive hillside glass-and-stone residence designed for executive living and private entertaining in Abuja.',
    description:
      'Sample Listing — Set on a generous elevated plot in Maitama, this architectural residence features floor-to-ceiling sliding glass walls, natural stone retaining terraces, and panoramic views across landscaped greenery.',
    transactionType: 'sale',
    category: 'residential',
    location: {
      area: 'Maitama',
      city: 'Abuja',
      state: 'FCT Abuja',
    },
    priceNumeric: 850_000_000,
    priceDisplay: '₦850,000,000',
    availability: 'Under Offer',
    published: true,
    featured: false,
    specifications: {
      landSize: '1,150 sqm',
      titleDocument: 'FCDA Certificate of Occupancy (Sample)',
      bedrooms: 6,
      bathrooms: 7,
      parkingSpaces: 6,
      yearBuilt: '2025',
    },
    features: [
      'Floor-to-ceiling architectural glazing',
      'Stone-paved pool deck & outdoor lounge terrace',
      'Guest chalet & two-room service quarters',
      'Solar-ready inverter housing & borehole infrastructure',
    ],
    photos: [
      {
        id: 'p-106-a',
        url: MEDIA_ASSETS.heroResidence,
        alt: 'Contemporary glass and stone villa with sunset terrace and pool',
        caption: 'Architectural terrace view (Sample preview photo)',
      },
      {
        id: 'p-106-b',
        url: MEDIA_ASSETS.detachedDuplex,
        alt: 'Front courtyard and landscaped garden entrance',
        caption: 'Arrival courtyard view (Sample preview photo)',
      },
    ],
    isSample: true,
    updatedAt: '2026-11-01',
  },
  {
    id: 'prop-7',
    referenceCode: 'NPL-107',
    slug: 'agricultural-and-peri-urban-land-rent-epe',
    title: 'Cleared Holding Land for Short-Term Yard Rental, Lekki-Epe Corridor',
    summary:
      '1,500 sqm dry fenced parcel available for annual rental as equipment staging, nursery, or storage yard.',
    description:
      'Sample Listing — A practical landed property rental along the rapidly expanding Lekki-Epe corridor. Ideal for construction contractors, landscaping operators, or modular storage businesses seeking annual tenancy without long-term lease lock-in.',
    transactionType: 'rent',
    category: 'land',
    location: {
      area: 'Lekki-Epe Corridor',
      city: 'Lagos',
      state: 'Lagos State',
    },
    priceNumeric: 12_000_000,
    priceDisplay: '₦12,000,000',
    priceCadence: 'per annum',
    availability: 'Available',
    published: true,
    featured: false,
    specifications: {
      landSize: '1,500 sqm',
      titleDocument: 'Annual Land Rental Agreement (Sample)',
      zoning: 'Mixed Commercial / Yard Use',
    },
    features: [
      'Direct trunk road proximity',
      'Fenced boundary with double-leaf steel gate',
      'Firm compacted dry ground',
    ],
    photos: [
      {
        id: 'p-107-a',
        url: MEDIA_ASSETS.landedEstatePlot,
        alt: 'Level fenced land along paved corridor road',
        caption: 'Accessible road frontage (Sample preview photo)',
      },
    ],
    isSample: true,
    updatedAt: '2026-10-28',
  },
  {
    id: 'prop-8',
    referenceCode: 'NPL-108',
    slug: 'wuse-ii-retail-showroom-rent-abuja',
    title: 'Street-Facing Commercial Showroom for Rent, Wuse II',
    summary:
      'High-visibility ground-floor commercial space suitable for retail flagship, banking lounge, or client studio.',
    description:
      'Sample Listing — Ground-floor commercial unit featuring tall glass display frontage, dedicated visitor parking bays, and prominent signage positioning in Wuse II.',
    transactionType: 'rent',
    category: 'commercial',
    location: {
      area: 'Wuse II',
      city: 'Abuja',
      state: 'FCT Abuja',
    },
    priceNumeric: 32_000_000,
    priceDisplay: '₦32,000,000',
    priceCadence: 'per annum',
    availability: 'Available',
    published: true,
    featured: false,
    specifications: {
      landSize: '310 sqm showroom',
      titleDocument: 'Commercial Tenancy Agreement (Sample)',
      parkingSpaces: 5,
    },
    features: [
      'Full-height street display glazing',
      'Dedicated visitor parking apron',
      'Backup generator bay & private restrooms',
    ],
    photos: [
      {
        id: 'p-108-a',
        url: MEDIA_ASSETS.commercialTower,
        alt: 'Modern commercial building street-level plaza and entrance',
        caption: 'Ground-floor commercial frontage (Sample preview photo)',
      },
    ],
    isSample: true,
    updatedAt: '2026-10-24',
  },
];

export const SAMPLE_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    slug: 'verifying-land-title-documents-before-purchase',
    title: 'Essential Checks Before Acquiring Landed Property in Urban Growth Corridors',
    excerpt:
      'A practical checklist covering survey plan verification, title documentation, and physical site inspections prior to commitment.',
    content: [
      'Sample Article — Acquiring landed property begins long before signing a deed of assignment. Buyers and corporate investors benefit from confirming the physical survey coordinates against official registry records to verify that the parcel is free from encumbrances or government acquisition.',
      'During a guided physical inspection, pay close attention to elevation, surrounding drainage channels, road setback allowances, and existing perimeter beacons. At Naeleseneh Properties Limited (Philo Eseneh & Co), we encourage prospective buyers to conduct independent legal searches alongside physical inspections.',
      'This placeholder editorial guide is prepared for preview purposes and can be updated or replaced with client-approved articles through the Staff Dashboard or data configuration.',
    ],
    category: 'Investment Tips',
    publishedAt: '2026-11-04',
    readTime: '4 min read',
    author: 'Naeleseneh Editorial Desk (Sample)',
    coverUrl: MEDIA_ASSETS.landedEstatePlot,
    coverAlt: 'Cleared serviced estate land parcel with paved road',
    published: true,
    isSample: true,
  },
  {
    id: 'art-2',
    slug: 'structuring-commercial-leases-for-growing-businesses',
    title: 'Renting vs. Long-Term Leasing: Choosing the Right Commercial Arrangement',
    excerpt:
      'How businesses weigh annual tenancy flexibility against multi-year commercial lease stability for offices and land.',
    content: [
      'Sample Article — Whether securing an office floor or leasing commercial acreage, the distinction between short-term annual rentals and structured multi-year leases shapes capital planning and fit-out investments.',
      'Annual rentals offer agility for teams testing new markets, while multi-year leases allow tenants to amortize custom interior fit-outs and secure predictable occupancy terms. Clarifying maintenance responsibilities, renewal options, and escalation clauses upfront prevents friction later.',
      'Replace this sample article with company-approved market insights before public launch.',
    ],
    category: 'Industry News',
    publishedAt: '2026-10-27',
    readTime: '3 min read',
    author: 'Naeleseneh Editorial Desk (Sample)',
    coverUrl: MEDIA_ASSETS.commercialTower,
    coverAlt: 'Modern commercial office plaza in warm afternoon light',
    published: true,
    isSample: true,
  },
  {
    id: 'art-3',
    slug: 'what-to-expect-during-guided-property-inspection',
    title: 'Preparing for Your Guided Property Inspection: Questions Worth Asking',
    excerpt:
      'From utility reliability and service charges to neighbourhood access, here is how to get the most from every site visit.',
    content: [
      'Sample Article — Photographs introduce a property, but an in-person inspection reveals natural light patterns, acoustic privacy, access road conditions, and build quality.',
      'When you submit an inspection request through our website, a member of our team follows up to coordinate a convenient appointment and ensure relevant documentation summaries are ready for review on site.',
      'This sample update illustrates the News & Insights article layout and can be edited in the Staff Portal preview.',
    ],
    category: 'Property Updates',
    publishedAt: '2026-10-19',
    readTime: '3 min read',
    author: 'Naeleseneh Editorial Desk (Sample)',
    coverUrl: MEDIA_ASSETS.detachedDuplex,
    coverAlt: 'Contemporary residential duplex with landscaped garden',
    published: true,
    isSample: true,
  },
];

export const SAMPLE_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    topic: 'Purchases',
    question: 'What types of properties does Naeleseneh Properties Limited offer for sale?',
    answer:
      'Provisional answer: We facilitate the purchase and sale of residential homes, commercial buildings, and landed properties—including serviced estate plots and development parcels. Filter by Sale or Landed Properties in our directory to review current sample listings.',
    isProvisional: true,
  },
  {
    id: 'faq-2',
    topic: 'Purchases',
    question: 'Can I verify title documentation before committing to a purchase?',
    answer:
      'Provisional answer: Yes. Summary title details are shown on each property page, and our staff coordinate access for independent legal due diligence and survey verification prior to any formal purchase agreement.',
    isProvisional: true,
  },
  {
    id: 'faq-3',
    topic: 'Rentals',
    question: 'How do rental enquiries and tenancy terms work?',
    answer:
      'Provisional answer: Rental listings display the annual or periodic rental rate and availability status. Submit an enquiry on the listing page and our team will share applicable tenancy requirements, service charge breakdowns, and inspection availability.',
    isProvisional: true,
  },
  {
    id: 'faq-4',
    topic: 'Leasing',
    question: 'What is the difference between Rent and Lease on your directory?',
    answer:
      'Provisional answer: Rent typically covers standard residential or commercial tenancies renewed annually, whereas Lease highlights structured multi-year commercial space or long-term landed property ground-lease arrangements.',
    isProvisional: true,
  },
  {
    id: 'faq-5',
    topic: 'Inspections',
    question: 'How are property inspections scheduled?',
    answer:
      'Provisional answer: Select "Schedule an Inspection" on any property detail page and submit your preferred contact details and timeframe. Live self-service calendar booking is not automated online—a staff representative will follow up directly to confirm the inspection appointment.',
    isProvisional: true,
  },
  {
    id: 'faq-6',
    topic: 'Company Services',
    question: 'Can landlords or property owners list properties with Philo Eseneh & Co?',
    answer:
      'Provisional answer: Yes. Landlords, developers, and landowners seeking to sell, rent, or lease vetted properties can reach out through our Contact Us page so our team can arrange an initial property assessment.',
    isProvisional: true,
  },
];

export const SAMPLE_ENQUIRIES: EnquiryItem[] = [
  {
    id: 'enq-1',
    type: 'Inspection Request',
    name: 'Chidi Nwosu (Sample)',
    email: 'chidi.sample@example.com',
    phone: '+234 800 123 4567',
    propertyRef: 'NPL-101',
    propertyTitle: 'Serviced Corner Residential Plot, Lekki Phase 1',
    preferredWindow: 'Weekday morning',
    message: 'Requesting a physical site inspection and survey coordinate overview for NPL-101.',
    createdAt: '2026-11-11 10:15',
    status: 'New',
  },
  {
    id: 'enq-2',
    type: 'Property Enquiry',
    name: 'Halima Bello (Sample)',
    email: 'halima.sample@example.com',
    phone: '+234 800 987 6543',
    propertyRef: 'NPL-104',
    propertyTitle: 'Grade-A Commercial Office Suite for Lease, Victoria Island',
    message: 'Could you confirm minimum lease duration and parking allocation for NPL-104?',
    createdAt: '2026-11-10 15:40',
    status: 'Reviewed',
  },
  {
    id: 'enq-3',
    type: 'General Enquiry',
    name: 'Tunde Adeyemi (Sample)',
    email: 'tunde.sample@example.com',
    phone: '+234 800 555 0199',
    message: 'Interested in listing a fenced 1,200 sqm commercial plot for lease.',
    createdAt: '2026-11-09 09:20',
    status: 'Inspection Scheduled',
  },
];

export const SAMPLE_PREVIEW_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'Awaiting Approved Client Attribution',
    roleOrContext: 'Land Acquisition Client',
    quote:
      'Approved testimonial placeholder — only displayed publicly once verified client copy is supplied and approved.',
    approved: false,
  },
];
