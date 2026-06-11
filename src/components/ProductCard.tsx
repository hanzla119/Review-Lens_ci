import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, Star, TrendingDown } from "lucide-react";
import type { Product } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const buildMissingImageCard = (product: Product) => {
  const platform = (product.platform || "Marketplace").slice(0, 24);
  const title = (product.name || "Product").slice(0, 42);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="675" viewBox="0 0 900 675">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef2ff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
      </defs>
      <rect width="900" height="675" fill="url(#bg)"/>
      <rect x="50" y="70" width="220" height="54" rx="27" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="160" y="104" text-anchor="middle" font-size="26" fill="#334155" font-family="Arial, sans-serif">${platform}</text>
      <text x="450" y="315" text-anchor="middle" font-size="38" fill="#0f172a" font-family="Arial, sans-serif">Image unavailable from source</text>
      <text x="450" y="370" text-anchor="middle" font-size="28" fill="#475569" font-family="Arial, sans-serif">${title}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const productImage = product.image && product.image !== "/placeholder.svg"
    ? product.image
    : buildMissingImageCard(product);

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
    // Convert incoming price to PKR for display.
    const EXCHANGE_RATES: Record<string, number> = {
      USD: 280, // 1 USD -> 280 PKR (adjust as needed)
    };

    const from = product.currency || "PKR";
    const rate = EXCHANGE_RATES[from] ?? (from === "PKR" ? 1 : 1);
    const amountInPKR = Math.round(price * rate);

    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amountInPKR);
  };

  return (
    <Card 
      variant="interactive" 
      className="group flex h-full transform flex-col overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
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
            event.currentTarget.src = "/placeholder.svg";
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
