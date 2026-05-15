import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldCheck, Star, TrendingDown } from "lucide-react";
import type { Product } from "@/data/mockData";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
      className="group overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge variant="glass">
            {product.platform}
          </Badge>
          {product.sourceDataset && (
            <Badge variant="secondary" className="max-w-[180px] truncate bg-white/90">
              Dataset
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="warning" className="flex items-center gap-1 bg-white text-accent-foreground">
              <TrendingDown className="w-3 h-3" />
              {discount}% OFF
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur">
          Best value
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
          <p className="text-xs font-medium text-muted-foreground">By {product.brand}</p>
        )}
      </CardHeader>

      <CardContent>
        {/* Sentiment Bar */}
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

        {/* Price */}
        <div className="flex items-end justify-between gap-4 border-t border-border pt-4">
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
