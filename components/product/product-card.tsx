'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { ProductWithVariants } from '@/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithVariants;
  productHref: string;
  showPrice?: boolean;
}

function isExternalOrPlacehold(url: string) {
  return (
    url.startsWith('http') &&
    (!url.includes('supabase') || url.includes('placehold.co'))
  );
}

export function ProductCard({
  product,
  productHref,
  showPrice = true,
}: ProductCardProps) {
  const mainImage =
    product.images && product.images.length > 0 ? product.images[0] : null;

  const variantThumbnails =
    product.variants
      ?.map((v) => (v.images && v.images.length > 0 ? v.images[0] : null))
      .filter((url): url is string => url != null) ?? [];

  // Tüm görseller: önce ana, sonra varyantlar (küçük karelerde hepsi, tıklanınca büyükte gösterilir)
  const allImages = [mainImage, ...variantThumbnails].filter(
    (url): url is string => url != null
  );

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(
    mainImage
  );

  const displayImage = selectedImageUrl ?? mainImage;

  const handleThumbnailClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageUrl(url);
  };

  return (
    <Link
      href={productHref}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-lg"
    >
      {/* Büyük ana resim (seçilen görsel) */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={isExternalOrPlacehold(displayImage)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Küçük kareler: tıklanınca büyük resim ile yer değiştirir */}
      {allImages.length > 1 && (
        <div className="flex gap-1.5 border-t border-gray-100 bg-gray-50/50 p-2">
          {allImages.slice(0, 6).map((url, i) => (
            <button
              key={`${product.id}-img-${i}`}
              type="button"
              onClick={(e) => handleThumbnailClick(e, url)}
              className={cn(
                'relative h-10 w-10 shrink-0 overflow-hidden rounded border-2 bg-white transition-colors',
                displayImage === url
                  ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                  : 'border-gray-200 hover:border-gray-400'
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
                unoptimized={isExternalOrPlacehold(url)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Ürün adı (ve isteğe bağlı fiyat) */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-gray-600">
          {product.name}
        </h3>
        {showPrice && (
          <p className="mt-2 text-lg font-bold text-gray-900">
            {formatPrice(product.base_price)}
          </p>
        )}
      </div>
    </Link>
  );
}
