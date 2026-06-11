import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, MessageSquare, Star, TrendingUp, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Product } from "@/data/mockData";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const WATCHLIST_KEY = "review_lens_watchlist";

const readWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
  } catch {
    return [];
  }
};

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    setIsWatchlisted(readWatchlist().some((item: { id: string }) => item.id === product.id));
  }, [product.id]);

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

  const mockReviews = product.reviews?.length ? product.reviews : [
    { id: 1, author: "Ahmad K.", rating: 5, text: "Excellent product! Worth every penny. The quality exceeded my expectations.", sentiment: "positive" },
    { id: 2, author: "Sara M.", rating: 4, text: "Good product overall, delivery was fast. Minor issues with packaging.", sentiment: "neutral" },
    { id: 3, author: "Hassan R.", rating: 5, text: "Best purchase I've made this year. Highly recommend to everyone!", sentiment: "positive" },
  ];

  const handleWatchlist = () => {
    const currentWatchlist = readWatchlist();
    const alreadySaved = currentWatchlist.some((item: { id: string }) => item.id === product.id);

    if (alreadySaved) {
      const updated = currentWatchlist.filter((item: { id: string }) => item.id !== product.id);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      setIsWatchlisted(false);
      return;
    }

    const watchlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      currency: product.currency || "PKR",
      image: product.image,
      platform: product.platform,
      category: product.category,
      brand: product.brand,
      sourceDataset: product.sourceDataset,
      productUrl: product.productUrl,
      addedAt: new Date().toISOString(),
    };

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify([watchlistItem, ...currentWatchlist]));
    setIsWatchlisted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <Card variant="default" className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 bg-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <CardHeader className="border-b border-border pb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-56 w-full flex-shrink-0 overflow-hidden rounded-3xl bg-muted md:w-64">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="default">{product.platform}</Badge>
                <Badge variant="secondary">{product.category}</Badge>
                {product.sourceDataset && <Badge variant="outline">{product.sourceDataset}</Badge>}
              </div>
              <CardTitle className="mb-3 pr-10 text-3xl leading-tight">{product.name}</CardTitle>
              {product.brand && <p className="mb-3 text-sm font-semibold text-primary">Brand / Store: {product.brand}</p>}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <span className="font-display text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
                {product.description ||
                  "Review Lens combines this product's dataset listing data, price movement, and customer sentiment so you can compare it before visiting the store."}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Sentiment Analysis */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Sentiment Analysis
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-success/10 p-4 text-center">
                <div className="text-3xl font-bold text-success mb-1">{product.sentiment.positive}%</div>
                <div className="text-sm text-muted-foreground">Positive</div>
              </div>
              <div className="rounded-2xl bg-warning/10 p-4 text-center">
                <div className="text-3xl font-bold text-warning mb-1">{product.sentiment.neutral}%</div>
                <div className="text-sm text-muted-foreground">Neutral</div>
              </div>
              <div className="rounded-2xl bg-destructive/10 p-4 text-center">
                <div className="text-3xl font-bold text-destructive mb-1">{product.sentiment.negative}%</div>
                <div className="text-sm text-muted-foreground">Negative</div>
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Price History
            </h3>
            <div className="h-64 rounded-3xl border border-border bg-muted/40 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={product.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "var(--shadow-card)",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [formatPrice(value), "Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold font-display mb-4">Dataset Specifications</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{key.replace(/_/g, " ")}</p>
                    <p className="mt-1 line-clamp-3 text-sm font-medium">
                      {Array.isArray(value) ? value.filter(Boolean).slice(0, 3).join(", ") : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Reviews */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Recent Reviews
            </h3>
            <div className="space-y-3">
              {mockReviews.map((review, index) => (
                <div key={`${review.author}-${index}`} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.author}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.text}</p>
                  <Badge
                    variant={review.sentiment === "positive" ? "success" : "warning"}
                    className="mt-2"
                  >
                    {review.sentiment}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {product.productUrl ? (
              <Button variant="hero" size="lg" className="flex-1" asChild>
                <a href={product.productUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open Dataset Product
                </a>
              </Button>
            ) : (
              <Button variant="hero" size="lg" className="flex-1">
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Store
              </Button>
            )}
            <Button
              variant={isWatchlisted ? "secondary" : "outline"}
              size="lg"
              className="flex-1"
              onClick={handleWatchlist}
            >
              {isWatchlisted && <CheckCircle2 className="mr-2 h-5 w-5" />}
              {isWatchlisted ? "Added to Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailModal;
