'use client';

import { useState } from 'react';
import { ProductImageGallery } from '@/components/ui/product-image-gallery';
import { ProductVariants } from '@/components/ui/product-variants';
import { Button } from '@/components/ui/button';
import { useCartDB } from '@/hooks/use-cart-db';
import { useAuthContext } from '@/store/auth-context';
import type { ProductVariant, ProductWithVariants } from '@/types/product';

export interface ProductDetailProps {
  product: ProductWithVariants;
  dict: {
    common?: { description?: string };
    product?: {
      variants?: string;
      stock?: string;
      outOfStock?: string;
      addToCart?: string;
      addingToCart?: string;
      loginToAdd?: string;
    };
  };
}

export function ProductDetail({ product, dict }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { user } = useAuthContext();
  const { addItem } = useCartDB();

  const variants = product.variants ?? [];
  const basePrice = product.base_price;
  const hasVariants = variants.length > 0;

  const selectedVariant = hasVariants && selectedVariantId
    ? variants.find((v: ProductVariant) => v.id === selectedVariantId)
    : null;
  /** Seçilen varyantın resimleri varsa onları, yoksa ürün resimlerini kullan */
  const activeImages =
    selectedVariant?.images?.length
      ? selectedVariant.images
      : product.images;
  const displayPrice = selectedVariant
    ? basePrice + (selectedVariant.price_modifier || 0)
    : basePrice;
  const canAddToCart = product.stock_quantity > 0 && (!selectedVariant || selectedVariant.stock_quantity > 0);

  const handleAddToCart = async () => {
    if (!canAddToCart) return;
    if (!user) {
      return; // UI'da loginToAdd mesajı gösterilebilir
    }
    setAdding(true);
    try {
      await addItem(product.id, selectedVariantId ?? undefined, 1);
    } finally {
      setAdding(false);
    }
  };

  const productLabels = dict.product ?? {};
  const descriptionLabel = dict.common?.description ?? 'Açıklama';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sol: Galeri — varyant seçilince o varyantın resimleri, yoksa ürün resimleri */}
        <ProductImageGallery
          images={activeImages}
          alt={product.name}
          className="lg:sticky lg:top-4"
        />

        {/* Sağ: Bilgi + varyantlar + sepete ekle */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.short_description && (
              <p className="text-gray-600">{product.short_description}</p>
            )}
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(displayPrice)}
            </p>
          </div>

          {hasVariants && (
            <ProductVariants
              variants={variants}
              basePrice={basePrice}
              selectedVariantId={selectedVariantId}
              onSelectVariant={setSelectedVariantId}
              labels={{
                variants: productLabels.variants,
                stock: productLabels.stock,
                outOfStock: productLabels.outOfStock,
              }}
            />
          )}

          <div className="mt-2">
            {user ? (
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart || adding}
                size="lg"
              >
                {adding ? (productLabels.addingToCart ?? 'Ekleniyor...') : (productLabels.addToCart ?? 'Sepete Ekle')}
              </Button>
            ) : (
              <p className="text-sm text-gray-500">{productLabels.loginToAdd ?? 'Sepete eklemek için giriş yapın'}</p>
            )}
          </div>

          {/* Açıklama */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-500">{descriptionLabel}</div>
            <div className="mt-2 whitespace-pre-wrap text-gray-700">
              {product.description ?? '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
