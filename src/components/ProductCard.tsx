import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, Star, TrendingDown } from "lucide-react";
import type { Product } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const fallbackImagePool = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900",
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900",
  "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=900",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=900",
  "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?w=900",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900",
  "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=900",
];

const hashSeed = (value = "") =>
  value
    .split("")
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);

const pickFallbackImage = (seed: string) => {
  const index = Math.abs(hashSeed(seed)) % fallbackImagePool.length;
  return fallbackImagePool[index];
};

const isRepeatedPlaceholderImage = (image = "") =>
  image.includes("example.com") ||
  image.includes("photo-1498049794561-7780e7231661") ||
  image.includes("photo-1505740420928-5e560c06d30e") ||
  image.includes("photo-1610945265064-0e34e5519bbf");

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const fallbackImage = pickFallbackImage(product.id || product.name);
  const productImage = isRepeatedPlaceholderImage(product.image) ? fallbackImage : product.image;

  const platformStyles: Record<string, string> = {
    Amazon: "bg-orange-50 text-orange-700 border-orange-200",
    Daraz: "bg-rose-50 text-rose-700 border-rose-200",
    Shopify: "bg-emerald-50 text-emerald-700 border-emerald-200",
    eBay: "bg-blue-50 text-blue-700 border-blue-200",
    AliExpress: "bg-red-50 text-red-700 border-red-200",
    Alibaba: "bg-amber-50 text-amber-800 border-amber-200",
  };

  const sentimentLabel =
    product.sentiment.positive >= 80
      ? "Highly positive"
      : product.sentiment.positive >= 65
        ? "Positive"
        : product.sentiment.positive >= 50
          ? "Mixed"
          : "Needs review";

  const sentimentStyle =
    product.sentiment.positive >= 65
      ? "bg-green-50 text-green-700 border-green-200"
      : product.sentiment.positive >= 50
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-red-50 text-red-700 border-red-200";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(product.currency === "USD" ? "en-US" : "en-PK", {
      style: "currency",
      currency: product.currency || "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card 
      variant="interactive" 
      className="group flex h-full transform flex-col overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={productImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
          <Badge variant="outline" className={`border font-bold shadow-sm ${platformStyles[product.platform] || "bg-white/90 text-foreground"}`}>
            {product.platform}
          </Badge>
          {discount > 0 && (
            <Badge variant="warning" className="flex items-center gap-1 bg-white text-accent-foreground">
              <TrendingDown className="w-3 h-3" />
              {discount}% OFF
            </Badge>
          )}
        </div>
        <div className={`absolute bottom-3 right-3 rounded-full border px-3 py-1 text-xs font-bold shadow-sm backdrop-blur ${sentimentStyle}`}>
          {sentimentLabel}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 min-h-[2.5rem] text-base leading-5 transition-colors group-hover:text-primary">
          {product.name}
        </CardTitle>
        {product.brand && (
          <p className="line-clamp-1 text-xs font-medium text-muted-foreground">By {product.brand}</p>
        )}
      </CardHeader>

      <CardContent className="mt-auto flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-green-200 bg-green-50 px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">Positive</p>
              <p className="mt-0.5 text-sm font-bold text-green-700">{product.sentiment.positive}%</p>
            </div>
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-yellow-700">Neutral</p>
              <p className="mt-0.5 text-sm font-bold text-yellow-700">{product.sentiment.neutral}%</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-red-700">Negative</p>
              <p className="mt-0.5 text-sm font-bold text-red-700">{product.sentiment.negative}%</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1 font-medium text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              Review sentiment
              </span>
              <span>{product.sentiment.positive}% positive</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden flex bg-secondary">
              <div
                className="bg-success transition-all duration-500"
                style={{ width: `${product.sentiment.positive}%` }}
              />
              <div
                className="bg-warning transition-all duration-500"
                style={{ width: `${product.sentiment.neutral}%` }}
              />
              <div
                className="bg-destructive transition-all duration-500"
                style={{ width: `${product.sentiment.negative}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-4">
          <div>
            <div className="font-display text-2xl font-bold text-foreground">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <ExternalLink className="w-4 h-4" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
