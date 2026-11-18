import React from 'react';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { StaffPage } from './pages/StaffPage';

const AppRouterView: React.FC = () => {
  const { pathname, navigate } = useAppState();
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (normalizedPath === '/staff' || normalizedPath.startsWith('/staff/')) {
    return <StaffPage />;
  }

  const isHome = normalizedPath === '/';

  let pageContent: React.ReactNode;
  if (isHome) {
    pageContent = <HomePage />;
  } else if (normalizedPath === '/properties') {
    pageContent = <PropertiesPage />;
  } else if (normalizedPath.startsWith('/properties/')) {
    const slug = decodeURIComponent(normalizedPath.slice('/properties/'.length));
    pageContent = <PropertyDetailPage slug={slug} />;
  } else if (normalizedPath === '/about') {
    pageContent = <AboutPage />;
  } else if (normalizedPath === '/services') {
    pageContent = <ServicesPage />;
  } else if (normalizedPath === '/contact') {
    pageContent = <ContactPage />;
  } else if (normalizedPath === '/faq') {
    pageContent = <FaqPage />;
  } else if (normalizedPath === '/news') {
    pageContent = <NewsPage />;
  } else if (normalizedPath.startsWith('/news/')) {
    const slug = decodeURIComponent(normalizedPath.slice('/news/'.length));
    pageContent = <NewsPage slug={slug} />;
  } else {
    pageContent = (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-xs font-semibold tracking-wider text-[#1E40AF] uppercase">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="mt-3 text-slate-600">
          The page you requested could not be found. Explore our property directory or return home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-full bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#17358F] cursor-pointer"
          >
            Go Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-800 text-sm font-semibold hover:border-[#1E40AF] cursor-pointer"
          >
            Browse Properties
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {!isHome && <SiteHeader variant="standard" />}
      <div className="flex-1">{pageContent}</div>
      <SiteFooter />
    </div>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <AppRouterView />
    </AppStateProvider>
  );
}
