import type { TestimonialItem } from '../types/realEstate';

export interface SiteConfig {
  company: {
    legalName: string;
    tradingName: string;
    rcNumber: string;
    tagline: string;
    logoUrl?: string; // Set to '/assets/naeleseneh-logo.png' when supplied
  };
  contact: {
    phoneNumbers: {
      display: string;
      href: string;
      whatsappNumber: string;
    }[];
    emailVerified: boolean;
    emailDisplay: string;
    emailHref?: string;
    addressVerified: boolean;
    officeAddress: string;
    officeHours: string;
    socialLinks: {
      label: string;
      url?: string;
      verified: boolean;
    }[];
    mapEmbedVerified: boolean;
    mapEmbedUrl?: string;
    mapDirectionsUrl: string;
  };
  services: {
    showSourcingAndConsultancy: boolean;
  };
  news: {
    enableNewsletter: boolean;
  };
  testimonials: {
    approvedItems: TestimonialItem[];
  };
  seo: {
    canonicalDomainPlaceholder: string;
    defaultTitle: string;
    defaultDescription: string;
  };
}

export const INITIAL_SITE_CONFIG: SiteConfig = {
  company: {
    legalName: 'NAELESENEH PROPERTIES LIMITED',
    tradingName: 'Philo Eseneh & Co',
    rcNumber: 'RC 8154311',
    tagline: 'Explore land and properties for sale, rent, and lease.',
    logoUrl: '/assets/brand/naeleseneh-properties-logo.jpg',
  },
  contact: {
    phoneNumbers: [
      {
        display: '0803 344 3794',
        href: 'tel:+2348033443794',
        whatsappNumber: '2348033443794',
      },
      {
        display: '0811 211 2000',
        href: 'tel:+2348112112000',
        whatsappNumber: '2348112112000',
      },
    ],
    emailVerified: true,
    emailDisplay: 'philoeseneh@yahoo.com',
    emailHref: 'mailto:philoeseneh@yahoo.com',
    addressVerified: true,
    officeAddress: 'F74, Road 2, Ikota Shopping Complex, Lagos, Nigeria',
    officeHours: 'Monday – Friday, 9:00 AM – 5:00 PM WAT (Provisional)',
    socialLinks: [
      { label: 'Instagram', url: undefined, verified: false },
      { label: 'LinkedIn', url: undefined, verified: false },
    ],
    mapEmbedVerified: true,
    mapEmbedUrl:
      'https://www.google.com/maps?q=F74%2C%20Road%202%2C%20Ikota%20Shopping%20Complex%2C%20Lagos%2C%20Nigeria&output=embed',
    mapDirectionsUrl:
      'https://www.google.com/maps/search/?api=1&query=F74%2C%20Road%202%2C%20Ikota%20Shopping%20Complex%2C%20Lagos%2C%20Nigeria',
  },
  services: {
    // Configurable: enable after client confirms Property Sourcing & Advisory Consultancy copy
    showSourcingAndConsultancy: false,
  },
  news: {
    // Configurable: stays hidden until newsletter backend is connected and enabled
    enableNewsletter: false,
  },
  testimonials: {
    // Only display approved client testimonials when supplied
    approvedItems: [],
  },
  seo: {
    canonicalDomainPlaceholder: 'https://www.naelesenehproperties.com',
    defaultTitle: 'Naeleseneh Properties Limited | Land & Property for Sale, Rent & Lease',
    defaultDescription:
      'Explore land and properties for sale, rent, and lease with Naeleseneh Properties Limited (Philo Eseneh & Co). RC 8154311.',
  },
};
