import React, { useEffect, useId, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { SmartImage } from '../components/SmartImage';
import { useAppState } from '../context/AppStateContext';
import type { ArticleCategory } from '../types/realEstate';
import { validateNewsletterEmail } from '../utils/propertyFilters';

interface NewsPageProps {
  slug?: string;
}

const CATEGORIES: Array<'All' | ArticleCategory> = [
  'All',
  'Property Updates',
  'Investment Tips',
  'Industry News',
];

export const NewsPage: React.FC<NewsPageProps> = ({ slug }) => {
  const { articles, siteConfig, navigate, setPageMeta } = useAppState();
  const [activeCategory, setActiveCategory] = useState<'All' | ArticleCategory>('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [newsletterDone, setNewsletterDone] = useState(false);
  const inputId = useId();

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.published),
    [articles]
  );

  const selectedArticle = useMemo(
    () => (slug ? publishedArticles.find((a) => a.slug === slug || a.id === slug) : undefined),
    [publishedArticles, slug]
  );

  useEffect(() => {
    if (slug && selectedArticle) {
      setPageMeta({
        title: `${selectedArticle.title} | News & Insights | Naeleseneh Properties`,
        description: selectedArticle.excerpt,
      });
    } else {
      setPageMeta({
        title: 'News & Insights | Naeleseneh Properties Limited',
        description:
          'Property updates, investment tips, and real estate market insights from Naeleseneh Properties Limited.',
      });
    }
  }, [selectedArticle, setPageMeta, slug]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateNewsletterEmail(newsletterEmail);
    setNewsletterError(err);
    if (err) return;
    setNewsletterDone(true);
    setNewsletterEmail('');
  };

  if (slug) {
    if (!selectedArticle) {
      return (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
          <p className="mt-2 text-slate-600">
            This article may be unpublished or unavailable in the current session.
          </p>
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="mt-6 px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] cursor-pointer"
          >
            Back to News &amp; Insights
          </button>
        </main>
      );
    }

    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <button
          type="button"
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#1E40AF] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to News &amp; Insights</span>
        </button>

        <article className="space-y-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
            <span className="text-[#1E40AF] font-semibold">{selectedArticle.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{selectedArticle.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedArticle.readTime}</span>
            {selectedArticle.isSample && (
              <>
                <span aria-hidden="true">·</span>
                <span>Sample Article</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {selectedArticle.title}
          </h1>

          <p className="text-sm text-slate-600">By {selectedArticle.author}</p>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <SmartImage
              src={selectedArticle.coverUrl}
              alt={selectedArticle.coverAlt}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="pt-2 space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
            {selectedArticle.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      </main>
    );
  }

  const visibleArticles =
    activeCategory === 'All'
      ? publishedArticles
      : publishedArticles.filter((a) => a.category === activeCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">
          News &amp; Insights · Sample Editorial Articles
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Property Updates &amp; Market Guides
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Articles covering land due diligence, leasing guidance, and real estate developments from Naeleseneh Properties Limited.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={active}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {visibleArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleArticles.map((article) => {
            const href = `/news/${article.slug}`;
            return (
              <article
                key={article.id}
                className="group border border-slate-200 bg-white rounded-2xl overflow-hidden flex flex-col hover:border-[#1E40AF]/40 transition-colors"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  <a href={href} onClick={(e) => handleNav(e, href)} className="block w-full h-full">
                    <SmartImage
                      src={article.coverUrl}
                      alt={article.coverAlt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </a>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
                      <span className="text-[#1E40AF] font-semibold">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{article.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h2 className="mt-2.5 text-lg font-bold text-slate-900 leading-snug">
                      <a
                        href={href}
                        onClick={(e) => handleNav(e, href)}
                        className="hover:text-[#1E40AF] transition-colors"
                      >
                        {article.title}
                      </a>
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <a
                    href={href}
                    onClick={(e) => handleNav(e, href)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E40AF] hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl p-8 text-center text-slate-600">
          No published articles found in this category.
        </div>
      )}

      {/* Optional Newsletter Form: stays hidden until enabled in configuration */}
      {siteConfig.news.enableNewsletter && (
        <section
          aria-label="Newsletter signup"
          className="border border-slate-200 bg-slate-50/80 rounded-2xl p-7 sm:p-10"
        >
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900">
              Subscribe to Property Updates (Demo Preview)
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Demo preview only — enter a sample email address. No subscription message is transmitted until a newsletter provider is connected.
            </p>

            {newsletterDone ? (
              <div
                role="status"
                className="mt-4 flex items-center gap-2.5 text-sm font-semibold text-emerald-700"
              >
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>Demo preview recorded — no live newsletter email was sent.</span>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="mt-4 flex flex-col sm:flex-row gap-3 items-start"
              >
                <div className="w-full sm:flex-1">
                  <label htmlFor={inputId} className="sr-only">
                    Email address
                  </label>
                  <input
                    id={inputId}
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="sample@example.com"
                    className="w-full h-11 px-4 rounded-full border border-slate-300 bg-white text-sm text-slate-900 focus:border-[#1E40AF] focus:outline-none"
                  />
                  {newsletterError && (
                    <p className="mt-1.5 text-xs font-medium text-red-700">{newsletterError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Subscribe (Demo)
                </button>
              </form>
            )}
          </div>
        </section>
      )}
    </main>
  );
};
