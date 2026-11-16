export interface NavItem {
  label: string;
  href: string;
  matchPrefix?: string;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Buy', href: '/properties?transaction=sale' },
  { label: 'Rent', href: '/properties?transaction=rent' },
  { label: 'Lease', href: '/properties?transaction=lease' },
  { label: 'Properties', href: '/properties' },
  { label: 'About Us', href: '/about' },
  { label: 'FAQ', href: '/faq' },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: 'Our Services', href: '/services' },
  { label: 'News & Insights', href: '/news' },
];
