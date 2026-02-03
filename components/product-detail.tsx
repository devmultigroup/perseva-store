'use client';

import { useState, useEffect } from 'react';
import { ProductImageGallery } from '@/components/ui/product-image-gallery';
import { ProductVariants } from '@/components/ui/product-variants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      quantity?: string;
      addToCart?: string;
      addingToCart?: string;
      loginToAdd?: string;
    };
  };
}

export function ProductDetail({ product, dict }: ProductDetailProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { user } = useAuthContext();
  const { addItem } = useCartDB();

  const variants = product.variants ?? [];
  const basePrice = product.base_price;
  const hasVariants = variants.length > 0;

  const selectedVariant =
    hasVariants && selectedVariantId
      ? variants.find((v: ProductVariant) => v.id === selectedVariantId)
      : null;
  /** Seçilen varyantın resimleri varsa onları, yoksa ürün resimlerini kullan */
  const activeImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : product.images;
  const displayPrice = selectedVariant
    ? basePrice + (selectedVariant.price_modifier || 0)
    : basePrice;
  const maxStock = selectedVariant
    ? selectedVariant.stock_quantity
    : product.stock_quantity;
  const canAddToCart = maxStock > 0;
  const effectiveQuantity = Math.min(Math.max(1, quantity), maxStock);

  // Varyant veya stok değişince adedi stokla sınırla
  useEffect(() => {
    setQuantity((q) => Math.min(Math.max(1, q), maxStock));
  }, [selectedVariantId, maxStock]);

  const handleAddToCart = async () => {
    if (!canAddToCart) return;
    if (!user) return;
    setAdding(true);
    try {
      await addItem(
        product.id,
        selectedVariantId ?? undefined,
        effectiveQuantity
      );
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    const next = Math.max(1, Math.min(maxStock, value));
    setQuantity(next);
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
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
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

          <div className="mt-2 flex flex-wrap items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {productLabels.quantity ?? 'Adet'}:
                  </span>
                  <div className="flex items-center rounded-md border border-gray-300 bg-white">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 px-0"
                      disabled={!canAddToCart || quantity <= 1}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      aria-label={productLabels.quantity}
                    >
                      −
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      max={maxStock}
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) handleQuantityChange(v);
                      }}
                      className="w-14 [appearance:textfield] border-0 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      disabled={!canAddToCart}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 px-0"
                      disabled={!canAddToCart || quantity >= maxStock}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      aria-label={productLabels.quantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart || adding}
                  size="lg"
                >
                  {adding
                    ? (productLabels.addingToCart ?? 'Ekleniyor...')
                    : (productLabels.addToCart ?? 'Sepete Ekle')}
                </Button>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                {productLabels.loginToAdd ?? 'Sepete eklemek için giriş yapın'}
              </p>
            )}
          </div>

          {/* Açıklama */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm font-medium text-gray-500">
              {descriptionLabel}
            </div>
            <div className="mt-2 whitespace-pre-wrap text-gray-700">
              {product.description ?? '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
