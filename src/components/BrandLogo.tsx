import React, { useState } from 'react';
import { INITIAL_SITE_CONFIG } from '../config/siteConfig';
import { useAppState } from '../context/AppStateContext';

interface BrandLogoProps {
  variant?: 'header' | 'footer';
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'header', inverted = false }) => {
  const { siteConfig } = useAppState();
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const defaultLogoUrl = INITIAL_SITE_CONFIG.company.logoUrl;
  const configuredLogoUrl = siteConfig.company.logoUrl;
  const logoUrl = configuredLogoUrl && !failedUrls.includes(configuredLogoUrl)
    ? configuredLogoUrl
    : defaultLogoUrl;
  const isDefaultLogo = logoUrl === defaultLogoUrl;

  if (logoUrl && !failedUrls.includes(logoUrl)) {
    return (
      <span
        className={`block shrink-0 ${inverted ? 'rounded-lg bg-white p-2' : 'bg-white'}`}
      >
        <span
          className={`relative block aspect-[4/1] overflow-hidden ${
            variant === 'header' ? 'w-44 sm:w-48' : 'w-60'
          }`}
        >
          <img
            src={logoUrl}
            alt="Naeleseneh Properties Limited — Philo Eseneh & Co."
            width={isDefaultLogo ? 1600 : undefined}
            height={isDefaultLogo ? 533 : undefined}
            className={
              isDefaultLogo
                ? 'absolute left-1/2 top-1/2 h-auto w-[116%] max-w-none -translate-x-1/2 -translate-y-1/2'
                : 'h-full w-full object-contain'
            }
            onError={() => setFailedUrls((urls) => [...urls, logoUrl])}
          />
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 shrink-0 whitespace-nowrap">
      {/* Crisp geometric blue-and-white high-rise architectural emblem */}
      <svg
        viewBox="0 0 36 36"
        className="w-8 h-8 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <rect
          x="2"
          y="2"
          width="32"
          height="32"
          rx="8"
          className={inverted ? 'fill-white' : 'fill-[#1E40AF]'}
        />
        <path
          d="M10 28V13.5L17.5 8.5V28H10Z"
          className={inverted ? 'fill-[#1E40AF]' : 'fill-white'}
        />
        <path
          d="M19.5 28V11.5L26 15V28H19.5Z"
          className={inverted ? 'fill-[#1E40AF]/80' : 'fill-white/80'}
        />
        <rect
          x="12.5"
          y="15"
          width="2.5"
          height="2.5"
          className={inverted ? 'fill-white' : 'fill-[#1E40AF]'}
        />
        <rect
          x="12.5"
          y="19.5"
          width="2.5"
          height="2.5"
          className={inverted ? 'fill-white' : 'fill-[#1E40AF]'}
        />
        <rect
          x="21.5"
          y="17"
          width="2.2"
          height="2.2"
          className={inverted ? 'fill-white' : 'fill-[#1E40AF]'}
        />
        <rect
          x="21.5"
          y="21"
          width="2.2"
          height="2.2"
          className={inverted ? 'fill-white' : 'fill-[#1E40AF]'}
        />
      </svg>
      {variant === 'header' ? (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[15px] font-extrabold tracking-tight ${
              inverted ? 'text-white' : 'text-slate-900'
            }`}
          >
            NAELESENEH
          </span>
          <span
            className={`text-[9.5px] font-semibold tracking-[0.14em] mt-0.5 ${
              inverted ? 'text-blue-100' : 'text-[#1E40AF]'
            }`}
          >
            PROPERTIES
          </span>
        </span>
      ) : (
        <span className="flex flex-col leading-tight">
          <span
            className={`text-base font-extrabold tracking-tight ${
              inverted ? 'text-white' : 'text-slate-900'
            }`}
          >
            NAELESENEH PROPERTIES
          </span>
          <span
            className={`text-xs font-medium ${
              inverted ? 'text-blue-200' : 'text-slate-500'
            }`}
          >
            Philo Eseneh &amp; Co
          </span>
        </span>
      )}
    </span>
  );
};
