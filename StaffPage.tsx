import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Building2,
  Check,
  Edit3,
  ExternalLink,
  FileText,
  Inbox,
  Lock,
  LogOut,
  Plus,
  RotateCcw,
  Settings,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { SmartImage } from '../components/SmartImage';
import { useAppState } from '../context/AppStateContext';
import { MEDIA_ASSETS } from '../data/media';
import { SAMPLE_PREVIEW_TESTIMONIALS } from '../data/sampleData';
import type {
  ArticleCategory,
  AvailabilityStatus,
  NewsArticle,
  PropertyCategory,
  PropertyListing,
  PropertyPhoto,
  TransactionType,
} from '../types/realEstate';
import { slugifyTitle } from '../utils/propertyFilters';

type StaffTab = 'listings' | 'articles' | 'enquiries' | 'config';

const AVAILABILITY_OPTIONS: AvailabilityStatus[] = [
  'Available',
  'Under Offer',
  'Sold',
  'Rented',
  'Leased',
];

function createEmptyListingDraft(): PropertyListing {
  const num = Math.floor(200 + Math.random() * 700);
  return {
    id: `prop-${Date.now()}`,
    referenceCode: `NPL-${num}`,
    slug: `sample-listing-${num}`,
    title: '',
    summary: '',
    description: '',
    transactionType: 'sale',
    category: 'land',
    location: { area: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos State' },
    priceNumeric: 120_000_000,
    priceDisplay: '₦120,000,000',
    priceCadence: '',
    availability: 'Available',
    published: true,
    featured: false,
    specifications: {
      landSize: '600 sqm',
      titleDocument: 'Certificate of Occupancy (Sample)',
      zoning: 'Residential',
    },
    features: ['Paved road access', 'Perimeter fencing'],
    photos: [
      {
        id: `photo-${Date.now()}`,
        url: MEDIA_ASSETS.landedEstatePlot,
        alt: 'Sample landed property preview',
        caption: 'Sample preview image',
      },
    ],
    videoUrl: '',
    isSample: true,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function createEmptyArticleDraft(): NewsArticle {
  return {
    id: `art-${Date.now()}`,
    slug: `sample-article-${Date.now()}`,
    title: '',
    excerpt: '',
    content: [''],
    category: 'Property Updates',
    publishedAt: new Date().toISOString().slice(0, 10),
    readTime: '3 min read',
    author: 'Naeleseneh Editorial Desk (Sample)',
    coverUrl: MEDIA_ASSETS.detachedDuplex,
    coverAlt: 'Property insight cover image',
    published: true,
    isSample: true,
  };
}

export const StaffPage: React.FC = () => {
  const {
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
    updateEnquiryStatus,
    updateSiteConfig,
    resetDemoSession,
    navigate,
    setPageMeta,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<StaffTab>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingListing, setEditingListing] = useState<PropertyListing | null>(null);
  const [listingFormError, setListingFormError] = useState<string | null>(null);
  const [featuresText, setFeaturesText] = useState('');

  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [articleBodyText, setArticleBodyText] = useState('');
  const [articleFormError, setArticleFormError] = useState<string | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginHint, setLoginHint] = useState<string | null>(null);

  const baseId = useId();

  useEffect(() => {
    setPageMeta({
      title: 'Staff Portal Preview (Demo) | Naeleseneh Properties Limited',
      description: 'Internal staff management preview. Excluded from search indexing.',
      noIndex: true,
    });
  }, [setPageMeta]);

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((item) =>
      `${item.referenceCode} ${item.title} ${item.location.area} ${item.category} ${item.transactionType}`
        .toLowerCase()
        .includes(q)
    );
  }, [listings, searchQuery]);

  const startNewListing = () => {
    const draft = createEmptyListingDraft();
    setEditingListing(draft);
    setFeaturesText(draft.features.join('\n'));
    setListingFormError(null);
  };

  const startEditListing = (item: PropertyListing) => {
    setEditingListing(JSON.parse(JSON.stringify(item)) as PropertyListing);
    setFeaturesText(item.features.join('\n'));
    setListingFormError(null);
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    if (!editingListing.title.trim()) {
      setListingFormError('Please enter a property title.');
      return;
    }
    if (!editingListing.referenceCode.trim()) {
      setListingFormError('Please enter a reference code.');
      return;
    }
    if (!editingListing.location.area.trim()) {
      setListingFormError('Please enter a location area.');
      return;
    }

    const cleanSlug =
      slugifyTitle(editingListing.title) || editingListing.slug || `listing-${Date.now()}`;
    const parsedFeatures = featuresText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    upsertListing({
      ...editingListing,
      slug: cleanSlug,
      features: parsedFeatures,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setEditingListing(null);
    setListingFormError(null);
  };

  const handleLocalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingListing || !e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        const newPhoto: PropertyPhoto = {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          url: reader.result,
          alt: `${editingListing.title || 'Uploaded property'} local preview`,
          caption: `Local preview: ${file.name}`,
        };
        setEditingListing((prev) =>
          prev ? { ...prev, photos: [...prev.photos, newPhoto] } : prev
        );
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    if (!editingListing) return;
    const target = index + direction;
    if (target < 0 || target >= editingListing.photos.length) return;
    const nextPhotos = [...editingListing.photos];
    const [moved] = nextPhotos.splice(index, 1);
    nextPhotos.splice(target, 0, moved);
    setEditingListing({ ...editingListing, photos: nextPhotos });
  };

  const removePhoto = (photoId: string) => {
    if (!editingListing) return;
    setEditingListing({
      ...editingListing,
      photos: editingListing.photos.filter((p) => p.id !== photoId),
    });
  };

  const startNewArticle = () => {
    const draft = createEmptyArticleDraft();
    setEditingArticle(draft);
    setArticleBodyText('');
    setArticleFormError(null);
  };

  const startEditArticle = (art: NewsArticle) => {
    setEditingArticle(JSON.parse(JSON.stringify(art)) as NewsArticle);
    setArticleBodyText(art.content.join('\n\n'));
    setArticleFormError(null);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      setArticleFormError('Please enter an article title.');
      return;
    }
    const paragraphs = articleBodyText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length === 0) {
      setArticleFormError('Please add article body content.');
      return;
    }
    upsertArticle({
      ...editingArticle,
      slug: slugifyTitle(editingArticle.title) || editingArticle.slug,
      content: paragraphs,
    });
    setEditingArticle(null);
    setArticleFormError(null);
  };

  if (!isStaffDemoSignedIn) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <BrandLogo variant="header" />
            <span className="text-xs font-mono font-semibold text-[#1E40AF]">
              DEMO PREVIEW
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Staff Portal Sign-In
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              Frontend preview for Naeleseneh Properties staff workflows. Authentication is not wired yet—use <strong>Continue to demo</strong> below without credentials.
            </p>
          </div>

          <div className="rounded-xl bg-[#EFF6FF] border border-blue-200/80 p-3.5 text-xs text-slate-700 leading-relaxed">
            <strong>Session Preview:</strong> Any listings you publish, edit, or mark as Sold/Leased in this demo appear immediately in the public property directory during this browser session.
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loginEmail.trim() || !loginPassword.trim()) {
                setLoginHint(
                  'Live credentials are not configured in this preview. Click "Continue to demo" below to enter immediately.'
                );
                return;
              }
              signInStaffDemo();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor={`${baseId}-email`}
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Staff Email (Preview)
              </label>
              <input
                id={`${baseId}-email`}
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="staff@naeleseneh-demo.example"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#1E40AF] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor={`${baseId}-password`}
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password (Preview)
              </label>
              <input
                id={`${baseId}-password`}
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#1E40AF] focus:outline-none"
              />
            </div>

            {loginHint && <p className="text-xs font-medium text-[#1E40AF]">{loginHint}</p>}

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={signInStaffDemo}
                className="w-full h-11 px-5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to demo</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="submit"
                className="w-full h-10 px-4 rounded-full border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign in (requires backend auth at launch)</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-600 hover:text-[#1E40AF] cursor-pointer"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Staff Sidebar */}
      <aside className="lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-5 flex flex-col justify-between gap-6 shrink-0">
        <div className="space-y-6">
          <div>
            <BrandLogo variant="header" />
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Staff Dashboard Preview · Temporary Session
            </p>
          </div>

          <nav aria-label="Staff dashboard sections" className="space-y-1">
            {(
              [
                {
                  key: 'listings',
                  label: `Listings (${listings.length})`,
                  icon: Building2,
                },
                {
                  key: 'articles',
                  label: `Articles (${articles.length})`,
                  icon: FileText,
                },
                {
                  key: 'enquiries',
                  label: `Enquiries (${enquiries.length})`,
                  icon: Inbox,
                },
                {
                  key: 'config',
                  label: 'Config & Handoff',
                  icon: Settings,
                },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#EFF6FF] text-[#1E40AF]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors cursor-pointer"
          >
            <span>View Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={resetDemoSession}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Sample Session</span>
          </button>

          <button
            type="button"
            onClick={signOutStaffDemo}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exit Demo Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <p className="text-xs font-mono text-slate-500">
              Staff Portal Preview / {activeTab} · noindex active
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {activeTab === 'listings' && 'Property Listings Manager'}
              {activeTab === 'articles' && 'News & Insights Manager'}
              {activeTab === 'enquiries' && 'Enquiry & Inspection Inbox'}
              {activeTab === 'config' && 'Site Configuration & Launch Handoff'}
            </h1>
          </div>

          {activeTab === 'listings' && !editingListing && (
            <button
              type="button"
              onClick={startNewListing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Sample Listing</span>
            </button>
          )}

          {activeTab === 'articles' && !editingArticle && (
            <button
              type="button"
              onClick={startNewArticle}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Sample Article</span>
            </button>
          )}
        </header>

        {/* TAB 1: LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {editingListing ? (
              <form
                onSubmit={handleSaveListing}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">
                    {listings.some((l) => l.id === editingListing.id)
                      ? `Edit Listing (${editingListing.referenceCode})`
                      : 'Create New Sample Listing'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingListing(null)}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {listingFormError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                    {listingFormError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={editingListing.title}
                      onChange={(e) =>
                        setEditingListing({ ...editingListing, title: e.target.value })
                      }
                      placeholder="e.g. Serviced Corner Plot in Lekki Phase 1"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Reference Code *
                    </label>
                    <input
                      type="text"
                      value={editingListing.referenceCode}
                      onChange={(e) =>
                        setEditingListing({ ...editingListing, referenceCode: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Transaction Type
                    </label>
                    <select
                      value={editingListing.transactionType}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          transactionType: e.target.value as TransactionType,
                        })
                      }
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#1E40AF] focus:outline-none"
                    >
                      <option value="sale">Sale</option>
                      <option value="rent">Rent</option>
                      <option value="lease">Lease</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Property Category
                    </label>
                    <select
                      value={editingListing.category}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          category: e.target.value as PropertyCategory,
                        })
                      }
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#1E40AF] focus:outline-none"
                    >
                      <option value="land">Landed Property</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Availability Status
                    </label>
                    <select
                      value={editingListing.availability}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          availability: e.target.value as AvailabilityStatus,
                        })
                      }
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#1E40AF] focus:outline-none"
                    >
                      {AVAILABILITY_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Area / District *
                    </label>
                    <input
                      type="text"
                      value={editingListing.location.area}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          location: { ...editingListing.location, area: e.target.value },
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Display Price
                    </label>
                    <input
                      type="text"
                      value={editingListing.priceDisplay}
                      onChange={(e) =>
                        setEditingListing({ ...editingListing, priceDisplay: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm tabular-nums focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Numeric Price (for filtering)
                    </label>
                    <input
                      type="number"
                      value={editingListing.priceNumeric}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          priceNumeric: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm tabular-nums focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Price Cadence (optional)
                    </label>
                    <input
                      type="text"
                      value={editingListing.priceCadence ?? ''}
                      onChange={(e) =>
                        setEditingListing({ ...editingListing, priceCadence: e.target.value })
                      }
                      placeholder="e.g. per annum"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Land / Floor Size
                    </label>
                    <input
                      type="text"
                      value={editingListing.specifications.landSize}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          specifications: {
                            ...editingListing.specifications,
                            landSize: e.target.value,
                          },
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Title Document
                    </label>
                    <input
                      type="text"
                      value={editingListing.specifications.titleDocument}
                      onChange={(e) =>
                        setEditingListing({
                          ...editingListing,
                          specifications: {
                            ...editingListing.specifications,
                            titleDocument: e.target.value,
                          },
                        })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Optional Video URL
                    </label>
                    <input
                      type="url"
                      value={editingListing.videoUrl ?? ''}
                      onChange={(e) =>
                        setEditingListing({ ...editingListing, videoUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Summary
                    </label>
                    <textarea
                      rows={3}
                      value={editingListing.summary}
                      onChange={(e) =>
                        setEditingListing({ ...editingListing, summary: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Features (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Property Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingListing.description}
                    onChange={(e) =>
                      setEditingListing({ ...editingListing, description: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>

                {/* Photo Ordering & Local Image Upload Previews */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Property Photos &amp; Ordering
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload local image files for instant session preview or reorder existing photos.
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1E40AF] text-[#1E40AF] text-xs font-semibold hover:bg-[#EFF6FF] transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Upload Local Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleLocalPhotoUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    {editingListing.photos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50/70"
                      >
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                          <SmartImage
                            src={photo.url}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Photo {idx + 1} Alt Description
                          </label>
                          <input
                            type="text"
                            value={photo.alt}
                            onChange={(e) => {
                              const nextPhotos = editingListing.photos.map((p) =>
                                p.id === photo.id ? { ...p, alt: e.target.value } : p
                              );
                              setEditingListing({ ...editingListing, photos: nextPhotos });
                            }}
                            className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:border-[#1E40AF] focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => movePhoto(idx, -1)}
                            disabled={idx === 0}
                            aria-label={`Move photo ${idx + 1} up`}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 inline-flex items-center justify-center hover:border-[#1E40AF] cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => movePhoto(idx, 1)}
                            disabled={idx === editingListing.photos.length - 1}
                            aria-label={`Move photo ${idx + 1} down`}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 inline-flex items-center justify-center hover:border-[#1E40AF] cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            aria-label={`Remove photo ${idx + 1}`}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-red-600 inline-flex items-center justify-center hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingListing.published}
                        onChange={(e) =>
                          setEditingListing({ ...editingListing, published: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#1E40AF]"
                      />
                      <span>Published on public directory</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingListing.featured}
                        onChange={(e) =>
                          setEditingListing({ ...editingListing, featured: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#1E40AF]"
                      />
                      <span>Featured on homepage</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingListing(null)}
                      className="px-5 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] cursor-pointer"
                    >
                      Save Sample Listing
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter table by ref, title, or location..."
                    aria-label="Filter listings table"
                    className="w-full sm:w-80 h-10 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 tabular-nums">
                    {filteredListings.length} sample listings
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                        <th className="py-3 px-4">Ref</th>
                        <th className="py-3 px-4">Property</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4">Availability</th>
                        <th className="py-3 px-4">Visibility</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredListings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-mono text-xs font-semibold text-[#1E40AF] tabular-nums whitespace-nowrap">
                            {item.referenceCode}
                          </td>
                          <td className="py-3 px-4 min-w-[220px]">
                            <div className="font-semibold text-slate-900 line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500">{item.location.area}</div>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap capitalize">
                            {item.transactionType} · {item.category}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            {item.priceDisplay}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              aria-label={`Availability for ${item.referenceCode}`}
                              value={item.availability}
                              onChange={(e) =>
                                updateListingAvailability(
                                  item.id,
                                  e.target.value as AvailabilityStatus
                                )
                              }
                              className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#1E40AF] focus:outline-none"
                            >
                              {AVAILABILITY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => toggleListingPublished(item.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                                  item.published
                                    ? 'border-blue-200 bg-[#EFF6FF] text-[#1E40AF]'
                                    : 'border-slate-200 bg-slate-100 text-slate-600'
                                }`}
                              >
                                {item.published ? 'Published' : 'Draft'}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleListingFeatured(item.id)}
                                aria-label={
                                  item.featured
                                    ? `Unfeature ${item.referenceCode}`
                                    : `Feature ${item.referenceCode}`
                                }
                                title="Toggle Featured"
                                className={`w-7 h-7 rounded-lg border inline-flex items-center justify-center cursor-pointer ${
                                  item.featured
                                    ? 'border-amber-300 bg-amber-50 text-amber-600'
                                    : 'border-slate-200 text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                <Star
                                  className="w-3.5 h-3.5"
                                  fill={item.featured ? 'currentColor' : 'none'}
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => startEditListing(item)}
                                aria-label={`Edit ${item.referenceCode}`}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteListing(item.id)}
                                aria-label={`Delete ${item.referenceCode}`}
                                className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {editingArticle ? (
              <form
                onSubmit={handleSaveArticle}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {articles.some((a) => a.id === editingArticle.id)
                      ? 'Edit Sample Article'
                      : 'Create Sample Article'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="text-sm font-semibold text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {articleFormError && (
                  <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                    {articleFormError}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, title: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category
                    </label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          category: e.target.value as ArticleCategory,
                        })
                      }
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:border-[#1E40AF] focus:outline-none"
                    >
                      <option value="Property Updates">Property Updates</option>
                      <option value="Investment Tips">Investment Tips</option>
                      <option value="Industry News">Industry News</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Article Body (paragraphs separated by blank lines) *
                  </label>
                  <textarea
                    rows={6}
                    value={articleBodyText}
                    onChange={(e) => setArticleBodyText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-[#1E40AF] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingArticle.published}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, published: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#1E40AF]"
                    />
                    <span>Published on News &amp; Insights</span>
                  </label>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] cursor-pointer"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#1E40AF]">{art.category}</span>
                        <span>·</span>
                        <span className="tabular-nums">{art.publishedAt}</span>
                        <span>·</span>
                        <span>{art.published ? 'Published' : 'Draft'}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{art.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-1">{art.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleArticlePublished(art.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#1E40AF] cursor-pointer"
                      >
                        {art.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditArticle(art)}
                        aria-label={`Edit article ${art.title}`}
                        className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:border-[#1E40AF] cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteArticle(art.id)}
                        aria-label={`Delete article ${art.title}`}
                        className="p-2 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ENQUIRY INBOX */}
        {activeTab === 'enquiries' && (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
            {enquiries.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-600">
                No sample enquiries recorded in this session yet.
              </div>
            ) : (
              enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-[#1E40AF]">{enq.type}</span>
                      <span>·</span>
                      <span className="tabular-nums">{enq.createdAt}</span>
                      {enq.propertyRef && (
                        <>
                          <span>·</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {enq.propertyRef}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {enq.name}{' '}
                      <span className="font-normal text-sm text-slate-500">
                        ({enq.email} · {enq.phone})
                      </span>
                    </h3>
                    {enq.propertyTitle && (
                      <p className="text-xs font-medium text-slate-600">
                        Property: {enq.propertyTitle}
                      </p>
                    )}
                    {enq.preferredWindow && (
                      <p className="text-xs font-medium text-[#1E40AF]">
                        Preferred Window: {enq.preferredWindow}
                      </p>
                    )}
                    <p className="text-sm text-slate-700 leading-relaxed pt-1">{enq.message}</p>
                  </div>

                  <div className="shrink-0">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Follow-up Status
                    </label>
                    <select
                      value={enq.status}
                      onChange={(e) =>
                        updateEnquiryStatus(
                          enq.id,
                          e.target.value as 'New' | 'Reviewed' | 'Inspection Scheduled'
                        )
                      }
                      className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-[#1E40AF] focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Inspection Scheduled">Inspection Scheduled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: CONFIGURATION & LAUNCH HANDOFF */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Configurable Feature Toggles (Session Preview)
              </h2>
              <p className="text-sm text-slate-600">
                Toggle optional modules to preview how they appear before client sign-off.
              </p>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={siteConfig.services.showSourcingAndConsultancy}
                    onChange={(e) =>
                      updateSiteConfig((prev) => ({
                        ...prev,
                        services: {
                          ...prev.services,
                          showSourcingAndConsultancy: e.target.checked,
                        },
                      }))
                    }
                    className="mt-0.5 w-4 h-4 accent-[#1E40AF]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Publish Sourcing &amp; Consultancy on Our Services page
                    </div>
                    <div className="text-xs text-slate-500">
                      Kept hidden by default until client confirms advisory copy.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={siteConfig.news.enableNewsletter}
                    onChange={(e) =>
                      updateSiteConfig((prev) => ({
                        ...prev,
                        news: { ...prev.news, enableNewsletter: e.target.checked },
                      }))
                    }
                    className="mt-0.5 w-4 h-4 accent-[#1E40AF]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Enable Optional Newsletter Form on News &amp; Insights
                    </div>
                    <div className="text-xs text-slate-500">
                      Stays hidden until enabled and connected to a mailing provider.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={siteConfig.testimonials.approvedItems.length > 0}
                    onChange={(e) =>
                      updateSiteConfig((prev) => ({
                        ...prev,
                        testimonials: {
                          approvedItems: e.target.checked ? SAMPLE_PREVIEW_TESTIMONIALS : [],
                        },
                      }))
                    }
                    className="mt-0.5 w-4 h-4 accent-[#1E40AF]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Preview Approved Testimonials Slot on Homepage
                    </div>
                    <div className="text-xs text-slate-500">
                      Remains hidden publicly until approved client testimonials are supplied.
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Backend, Storage, SEO &amp; Analytics Integration Points
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Property &amp; Article Data:</strong> Replace seed arrays in{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      src/data/sampleData.ts
                    </code>{' '}
                    and session storage in{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      src/context/AppStateContext.tsx
                    </code>{' '}
                    with database/API queries.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Staff Authentication &amp; Media Uploads:</strong> Connect real auth on{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      /staff
                    </code>{' '}
                    and cloud object storage in{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      handleLocalPhotoUpload
                    </code>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Form Delivery &amp; Newsletter:</strong> Wire{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      src/components/EnquiryForm.tsx
                    </code>{' '}
                    and the News newsletter handler to SMTP/CRM endpoints.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Analytics Events:</strong>{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      src/lib/analytics.ts
                    </code>{' '}
                    already emits <code className="font-mono text-xs">property_view</code>,{' '}
                    <code className="font-mono text-xs">property_enquiry</code>,{' '}
                    <code className="font-mono text-xs">inspection_request</code>, and{' '}
                    <code className="font-mono text-xs">whatsapp_click</code>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong>Canonical Domain &amp; Sitemap:</strong> Set canonical link tags against{' '}
                    <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                      siteConfig.seo.canonicalDomainPlaceholder
                    </code>{' '}
                    and generate <code className="font-mono text-xs">sitemap.xml</code> excluding{' '}
                    <code className="font-mono text-xs">/staff</code> at launch.
                  </span>
                </li>
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
