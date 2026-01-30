'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ProductImageGalleryProps {
  images: string[] | null;
  alt: string;
  className?: string;
}

const PLACEHOLDER = '__placeholder__';

/** Uzak URL'ler (Supabase vb.) Content-Type nedeniyle next/image hatası verebiliyor; onlar için native img kullanıyoruz. */
function isRemoteUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

function ProductImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (isRemoteUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(
          fill && 'absolute inset-0 h-full w-full',
          'object-contain',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill ?? false}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function ProductImageGallery({
  images,
  alt,
  className,
}: ProductImageGalleryProps) {
  const list = images?.length ? images : [PLACEHOLDER];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentSrc = list[selectedIndex];
  const isPlaceholder = !currentSrc || currentSrc === PLACEHOLDER;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Ana resim */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        {isPlaceholder ? (
          <div
            className="flex h-full w-full items-center justify-center text-gray-400"
            aria-hidden
          >
            <svg
              className="h-24 w-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
          </div>
        ) : (
          <ProductImage
            src={currentSrc}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Thumbnail listesi - geçiş için */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
                selectedIndex === i
                  ? 'border-gray-900 ring-1 ring-gray-900'
                  : 'border-gray-200 hover:border-gray-400'
              )}
              aria-label={`Resim ${i + 1}`}
              aria-pressed={selectedIndex === i}
            >
              {src !== PLACEHOLDER &&
              src &&
              (src.startsWith('http') || src.startsWith('/')) ? (
                isRemoteUrl(src) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
