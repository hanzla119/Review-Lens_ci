import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Star, TrendingUp, MessageSquare, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Product } from "@/data/mockData";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const mockReviews = [
    { id: 1, author: "Ahmad K.", rating: 5, text: "Excellent product! Worth every penny. The quality exceeded my expectations.", sentiment: "positive" },
    { id: 2, author: "Sara M.", rating: 4, text: "Good product overall, delivery was fast. Minor issues with packaging.", sentiment: "neutral" },
    { id: 3, author: "Hassan R.", rating: 5, text: "Best purchase I've made this year. Highly recommend to everyone!", sentiment: "positive" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <Card variant="glass" className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="default">{product.platform}</Badge>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <CardTitle className="text-2xl mb-3">{product.name}</CardTitle>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold font-display text-gradient">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
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
              <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-success mb-1">{product.sentiment.positive}%</div>
                <div className="text-sm text-muted-foreground">Positive</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-warning mb-1">{product.sentiment.neutral}%</div>
                <div className="text-sm text-muted-foreground">Neutral</div>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
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
            <div className="glass-card p-4 rounded-xl h-64">
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

          {/* Sample Reviews */}
          <div>
            <h3 className="text-lg font-semibold font-display mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Recent Reviews
            </h3>
            <div className="space-y-3">
              {mockReviews.map((review) => (
                <div key={review.id} className="glass-card p-4 rounded-xl">
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
            <Button variant="hero" size="lg" className="flex-1">
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Store
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              Add to Watchlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailModal;
