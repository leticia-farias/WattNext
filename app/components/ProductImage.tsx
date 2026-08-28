'use client';
import { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';

interface ProductImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
  containerClassName?: string;
}

export function ProductImage({
  src,
  alt,
  category,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-40 bg-gray-100 overflow-hidden relative flex items-center justify-center',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div className={`${containerClassName} bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center p-4`}>
        <CategoryIcon category={category} size={36} className="mb-1 text-emerald-600 opacity-80" />
        <span className="text-[11px] font-medium text-emerald-800 text-center line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <CategoryIcon category={category} size={28} className="text-gray-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}
