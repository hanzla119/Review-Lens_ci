import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingDown, ExternalLink } from "lucide-react";
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
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card 
      variant="interactive" 
      className="overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="glass" className="backdrop-blur-xl">
            {product.platform}
          </Badge>
          {discount > 0 && (
            <Badge variant="success" className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {discount}% OFF
            </Badge>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Sentiment Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Sentiment Analysis</span>
            <span>{product.sentiment.positive}% Positive</span>
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
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold font-display text-foreground">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          <Button variant="hero" size="sm">
            <ExternalLink className="w-4 h-4" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
