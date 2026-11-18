import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackLabel?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/70 to-slate-200 text-slate-600 p-6 text-center ${className}`}
      >
        <Building2 className="w-8 h-8 text-[#1E40AF]/60 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600 max-w-xs">
          {fallbackLabel || alt || 'Property media preview'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
