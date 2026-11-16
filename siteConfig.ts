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
    phoneVerified: boolean;
    phoneDisplay: string;
    phoneHref?: string;
    emailVerified: boolean;
    emailDisplay: string;
    emailHref?: string;
    addressVerified: boolean;
    officeAddress: string;
    officeHours: string;
    whatsappVerified: boolean;
    whatsappNumber?: string;
    whatsappLabel: string;
    socialLinks: {
      label: string;
      url?: string;
      verified: boolean;
    }[];
    mapEmbedVerified: boolean;
    mapEmbedUrl?: string;
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
    logoUrl: undefined,
  },
  contact: {
    phoneVerified: false,
    phoneDisplay: 'Official telephone number awaiting client verification',
    phoneHref: undefined,
    emailVerified: false,
    emailDisplay: 'Official contact email awaiting client verification',
    emailHref: undefined,
    addressVerified: false,
    officeAddress: 'Official office address awaiting client verification',
    officeHours: 'Monday – Friday, 9:00 AM – 5:00 PM WAT (Provisional)',
    whatsappVerified: false,
    whatsappNumber: undefined,
    whatsappLabel: 'WhatsApp link activates once official number is supplied',
    socialLinks: [
      { label: 'Instagram', url: undefined, verified: false },
      { label: 'LinkedIn', url: undefined, verified: false },
    ],
    mapEmbedVerified: false,
    mapEmbedUrl: undefined,
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
