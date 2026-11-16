import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';

interface BrandLogoProps {
  variant?: 'header' | 'footer';
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'header', inverted = false }) => {
  const { siteConfig } = useAppState();
  const [imgFailed, setImgFailed] = useState(false);

  if (siteConfig.company.logoUrl && !imgFailed) {
    return (
      <span className="inline-flex items-center gap-2.5 shrink-0">
        <img
          src={siteConfig.company.logoUrl}
          alt="Naeleseneh Properties Limited logo"
          className="h-9 w-auto object-contain"
          onError={() => setImgFailed(true)}
        />
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
