import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { INITIAL_SITE_CONFIG, type SiteConfig } from '../config/siteConfig';
import { SAMPLE_ARTICLES, SAMPLE_ENQUIRIES, SAMPLE_PROPERTIES } from '../data/sampleData';
import type {
  AvailabilityStatus,
  EnquiryItem,
  NewsArticle,
  PropertyListing,
} from '../types/realEstate';

interface SessionStateSnapshot {
  listings: PropertyListing[];
  articles: NewsArticle[];
  enquiries: EnquiryItem[];
  siteConfig: SiteConfig;
  isStaffDemoSignedIn: boolean;
}

const SESSION_KEY = 'naeleseneh_preview_session_v1';

function loadInitialSession(): SessionStateSnapshot {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SessionStateSnapshot>;
        return {
          listings: Array.isArray(parsed.listings) && parsed.listings.length > 0
            ? parsed.listings
            : SAMPLE_PROPERTIES,
          articles: Array.isArray(parsed.articles) && parsed.articles.length > 0
            ? parsed.articles
            : SAMPLE_ARTICLES,
          enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : SAMPLE_ENQUIRIES,
          siteConfig: parsed.siteConfig
            ? {
                ...INITIAL_SITE_CONFIG,
                ...parsed.siteConfig,
                services: {
                  ...INITIAL_SITE_CONFIG.services,
                  ...parsed.siteConfig.services,
                },
                news: {
                  ...INITIAL_SITE_CONFIG.news,
                  ...parsed.siteConfig.news,
                },
                testimonials: {
                  ...INITIAL_SITE_CONFIG.testimonials,
                  ...parsed.siteConfig.testimonials,
                },
              }
            : INITIAL_SITE_CONFIG,
          isStaffDemoSignedIn: Boolean(parsed.isStaffDemoSignedIn),
        };
      }
    } catch {
      // Fallback to default seed data if sessionStorage is unavailable
    }
  }
  return {
    listings: SAMPLE_PROPERTIES,
    articles: SAMPLE_ARTICLES,
    enquiries: SAMPLE_ENQUIRIES,
    siteConfig: INITIAL_SITE_CONFIG,
    isStaffDemoSignedIn: false,
  };
}

export interface PageMetaInput {
  title: string;
  description: string;
  noIndex?: boolean;
}

interface AppContextValue {
  pathname: string;
  search: string;
  navigate: (to: string, options?: { replace?: boolean; scrollTop?: boolean }) => void;
  setPageMeta: (meta: PageMetaInput) => void;
  listings: PropertyListing[];
  articles: NewsArticle[];
  enquiries: EnquiryItem[];
  siteConfig: SiteConfig;
  isStaffDemoSignedIn: boolean;
  signInStaffDemo: () => void;
  signOutStaffDemo: () => void;
  upsertListing: (listing: PropertyListing) => void;
  deleteListing: (id: string) => void;
  toggleListingPublished: (id: string) => void;
  toggleListingFeatured: (id: string) => void;
  updateListingAvailability: (id: string, availability: AvailabilityStatus) => void;
  upsertArticle: (article: NewsArticle) => void;
  deleteArticle: (id: string) => void;
  toggleArticlePublished: (id: string) => void;
  addEnquiry: (enquiry: Omit<EnquiryItem, 'id' | 'createdAt' | 'status'>) => EnquiryItem;
  updateEnquiryStatus: (id: string, status: EnquiryItem['status']) => void;
  updateSiteConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
  resetDemoSession: () => void;
}

const AppStateContext = createContext<AppContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initial] = useState<SessionStateSnapshot>(loadInitialSession);
  const [listings, setListings] = useState<PropertyListing[]>(initial.listings);
  const [articles, setArticles] = useState<NewsArticle[]>(initial.articles);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initial.enquiries);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initial.siteConfig);
  const [isStaffDemoSignedIn, setIsStaffDemoSignedIn] = useState<boolean>(
    initial.isStaffDemoSignedIn
  );

  const [locationState, setLocationState] = useState<{ pathname: string; search: string }>(() => {
    if (typeof window === 'undefined') {
      return { pathname: '/', search: '' };
    }
    return {
      pathname: window.location.pathname || '/',
      search: window.location.search || '',
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const snapshot: SessionStateSnapshot = {
        listings,
        articles,
        enquiries,
        siteConfig,
        isStaffDemoSignedIn,
      };
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore storage quota errors for large local preview uploads
    }
  }, [listings, articles, enquiries, siteConfig, isStaffDemoSignedIn]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setLocationState({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (to: string, options: { replace?: boolean; scrollTop?: boolean } = {}) => {
      if (typeof window === 'undefined') return;
      const url = new URL(to, window.location.origin);
      const nextPath = url.pathname || '/';
      const nextSearch = url.search || '';
      const fullTarget = `${nextPath}${nextSearch}${url.hash}`;

      if (options.replace) {
        window.history.replaceState({}, '', fullTarget);
      } else {
        window.history.pushState({}, '', fullTarget);
      }
      setLocationState({ pathname: nextPath, search: nextSearch });

      if (url.hash) {
        requestAnimationFrame(() => {
          const targetEl = document.getElementById(url.hash.slice(1));
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      } else if (options.scrollTop !== false) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    []
  );

  const setPageMeta = useCallback((meta: PageMetaInput) => {
    if (typeof document === 'undefined') return;
    document.title = meta.title;

    const updateMetaTag = (selector: string, attrName: 'name' | 'property', key: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);

    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (meta.noIndex) {
      updateMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else if (existingRobots) {
      existingRobots.remove();
    }
  }, []);

  const signInStaffDemo = useCallback(() => {
    setIsStaffDemoSignedIn(true);
  }, []);

  const signOutStaffDemo = useCallback(() => {
    setIsStaffDemoSignedIn(false);
  }, []);

  const upsertListing = useCallback((listing: PropertyListing) => {
    setListings((prev) => {
      const idx = prev.findIndex((item) => item.id === listing.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = listing;
        return next;
      }
      return [listing, ...prev];
    });
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleListingPublished = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, published: !item.published, updatedAt: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
  }, []);

  const toggleListingFeatured = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, featured: !item.featured, updatedAt: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
  }, []);

  const updateListingAvailability = useCallback((id: string, availability: AvailabilityStatus) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, availability, updatedAt: new Date().toISOString().slice(0, 10) }
          : item
      )
    );
  }, []);

  const upsertArticle = useCallback((article: NewsArticle) => {
    setArticles((prev) => {
      const idx = prev.findIndex((item) => item.id === article.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = article;
        return next;
      }
      return [article, ...prev];
    });
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleArticlePublished = useCallback((id: string) => {
    setArticles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, published: !item.published } : item))
    );
  }, []);

  const addEnquiry = useCallback(
    (input: Omit<EnquiryItem, 'id' | 'createdAt' | 'status'>): EnquiryItem => {
      const now = new Date();
      const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
      const entry: EnquiryItem = {
        ...input,
        id: `enq-${Date.now()}`,
        createdAt: timestamp,
        status: 'New',
      };
      setEnquiries((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const updateEnquiryStatus = useCallback((id: string, status: EnquiryItem['status']) => {
    setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const updateSiteConfig = useCallback((updater: (prev: SiteConfig) => SiteConfig) => {
    setSiteConfig((prev) => updater(prev));
  }, []);

  const resetDemoSession = useCallback(() => {
    setListings(SAMPLE_PROPERTIES);
    setArticles(SAMPLE_ARTICLES);
    setEnquiries(SAMPLE_ENQUIRIES);
    setSiteConfig(INITIAL_SITE_CONFIG);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        pathname: locationState.pathname,
        search: locationState.search,
        navigate,
        setPageMeta,
        listings,
        articles,
        enquiries,
        siteConfig,
        isStaffDemoSignedIn,
        signInStaffDemo,
        signOutStaffDemo,
        upsertListing,
        deleteListing,
        toggleListingPublished,
        toggleListingFeatured,
        updateListingAvailability,
        upsertArticle,
        deleteArticle,
        toggleArticlePublished,
        addEnquiry,
        updateEnquiryStatus,
        updateSiteConfig,
        resetDemoSession,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppState(): AppContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
}
