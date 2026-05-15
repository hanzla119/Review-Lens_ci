import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  MessageSquare,
  Package,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Store,
  TrendingDown,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import ChatInterface from "@/components/ChatInterface";
import { mockProducts, type Product } from "@/data/mockData";
import { productsApi } from "@/lib/productsApi";

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <Card key={index} variant="default" className="h-full overflow-hidden">
        <div className="aspect-[4/3] animate-pulse bg-muted" />
        <CardContent className="space-y-4 p-5">
          <div className="flex justify-between gap-3">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 animate-pulse rounded-2xl bg-muted" />
            <div className="h-14 animate-pulse rounded-2xl bg-muted" />
            <div className="h-14 animate-pulse rounded-2xl bg-muted" />
          </div>
          <div className="flex items-end justify-between border-t border-border pt-4">
            <div className="space-y-2">
              <div className="h-7 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

interface EmptyProductsStateProps {
  onReset: () => void;
}

const EmptyProductsState = ({ onReset }: EmptyProductsStateProps) => (
  <Card variant="default" className="border-dashed p-10 text-center">
    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary">
      <Package className="h-10 w-10" />
    </div>
    <h3 className="font-display text-2xl font-bold">No products found</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
      Your current search and filters did not match any dataset products. Reset filters
      to return to the full marketplace catalog.
    </p>
    <Button variant="hero" className="mt-6" onClick={onReset}>
      Reset Filters
    </Button>
  </Card>
);

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [datasetSource, setDatasetSource] = useState("local-demo-products");
  const [productError, setProductError] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductError("");

      try {
        const response = await productsApi.list(500);
        if (response.products.length > 0) {
          setProducts(response.products);
          setDatasetSource(response.source);
          setProductError("");
        }
      } catch (error) {
        setProducts(mockProducts);
        setDatasetSource("local-demo-products");
        setProductError("");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products],
  );

  const platforms = useMemo(
    () => Array.from(new Set(products.map((product) => product.platform).filter(Boolean))),
    [products],
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPlatform = !selectedPlatform || product.platform === selectedPlatform;
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const totals = products.reduce(
    (acc, product) => {
      acc.positive += product.sentiment.positive;
      acc.neutral += product.sentiment.neutral;
      acc.negative += product.sentiment.negative;
      acc.rating += product.rating;
      acc.reviews += product.reviewCount;
      if (product.originalPrice && product.originalPrice > product.price) acc.priceDrops += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0, rating: 0, reviews: 0, priceDrops: 0 },
  );

  const sentimentData = [
    { name: "Positive", value: Math.round(totals.positive / Math.max(products.length, 1)), color: "hsl(var(--success))" },
    { name: "Neutral", value: Math.round(totals.neutral / Math.max(products.length, 1)), color: "hsl(var(--warning))" },
    { name: "Negative", value: Math.round(totals.negative / Math.max(products.length, 1)), color: "hsl(var(--destructive))" },
  ];

  const platformData = platforms.map((platform) => ({
    name: platform,
    products: products.filter((product) => product.platform === platform).length,
  }));

  const topCategory =
    categories
      .filter((category) => category !== "All")
      .map((category) => ({
        category,
        count: products.filter((product) => product.category === category).length,
      }))
      .sort((a, b) => b.count - a.count)[0]?.category || "Electronics";

  const bestSentimentCategory =
    categories
      .filter((category) => category !== "All")
      .map((category) => {
        const categoryProducts = products.filter((product) => product.category === category);
        return {
          category,
          score:
            categoryProducts.reduce((sum, product) => sum + product.sentiment.positive, 0) /
            Math.max(categoryProducts.length, 1),
        };
      })
      .sort((a, b) => b.score - a.score)[0]?.category || "Electronics";

  const averageRating = products.length ? (totals.rating / products.length).toFixed(1) : "0.0";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedPlatform(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="marketplace-surface px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px] space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-4">Review Lens marketplace dashboard</Badge>
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                  Dataset-powered products with price, rating, and sentiment clarity.
                </h1>
                <p className="mt-4 max-w-3xl text-muted-foreground">
                  Search products fetched from public e-commerce datasets, filter by category
                  and source, inspect customer sentiment, and open detailed price trends.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="default">Source: {datasetSource}</Badge>
                  <Badge variant="outline">{products.length} products loaded</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:min-w-[360px]">
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <p className="mt-1 text-2xl font-bold text-primary">{platforms.length}</p>
                </div>
                <div className="rounded-2xl bg-accent/15 p-4">
                  <p className="text-sm text-muted-foreground">Positive sentiment</p>
                  <p className="mt-1 text-2xl font-bold text-accent-foreground">{sentimentData[0].value}%</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-border bg-muted/70 p-4">
                  <p className="text-sm font-semibold">Ask the assistant:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    "Find me a smartphone under PKR 50,000 with good reviews."
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Package, label: "Dataset products", value: products.length.toLocaleString(), change: datasetSource },
              { icon: Star, label: "Average rating", value: averageRating, change: "Live" },
              { icon: TrendingDown, label: "Discounted products", value: totals.priceDrops.toString(), change: "Now" },
              { icon: ShieldCheck, label: "Reviews analyzed", value: totals.reviews.toLocaleString(), change: "Dataset" },
            ].map((stat, index) => (
              <Card key={index} variant="default" className="h-full">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
                    <Badge variant="success" className="text-xs mt-1 max-w-[130px] truncate">{stat.change}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Store className="h-5 w-5 text-primary" />
                  Market snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  ["Top category", topCategory],
                  ["Most active source", platformData.sort((a, b) => b.products - a.products)[0]?.name || "Amazon"],
                  ["Best sentiment", bestSentimentCategory],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-muted/70 p-3">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-lg">Overall Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56 xl:h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={72}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="rounded-2xl bg-muted/60 p-2 text-center">
                      <div className="mx-auto mb-1 h-2 w-8 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-muted-foreground">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-lg">Products by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56 xl:h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformData} layout="vertical">
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "var(--shadow-card)",
                        }}
                      />
                      <Bar dataKey="products" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card variant="default" className="sticky top-24 z-20 border-primary/10 bg-white/95 backdrop-blur">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products across all platforms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2 bg-white">
                    <SlidersHorizontal className="w-4 h-4" />
                    Advanced filters
                  </Button>
                  <Button variant="ghost" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>

                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "hero" : "secondary"}
                      size="sm"
                      className="shrink-0"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  <Badge
                    variant={selectedPlatform === null ? "default" : "outline"}
                    className="shrink-0 cursor-pointer"
                    onClick={() => setSelectedPlatform(null)}
                  >
                    All Platforms
                  </Badge>
                  {platforms.map((platform) => (
                    <Badge
                      key={platform}
                      variant={selectedPlatform === platform ? "default" : "outline"}
                      className="shrink-0 cursor-pointer"
                      onClick={() => setSelectedPlatform(platform)}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-2xl font-bold">Dataset products</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} normalized products from public dataset sources.
                </p>
              </div>
              <Badge variant="accent" className="w-fit">
                Sorted by best insight score
              </Badge>
            </div>

            {productError && (
              <Card variant="default" className="border-warning/30 bg-warning/10">
                <CardContent className="p-4 text-sm font-medium text-warning">
                  {productError}
                </CardContent>
              </Card>
            )}

            {isLoadingProducts ? (
              <ProductGridSkeleton />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <EmptyProductsState onReset={resetFilters} />
            )}
          </section>
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Button
        variant="hero"
        size="xl"
        className="fixed bottom-6 right-6 rounded-full lg:hidden shadow-2xl"
        onClick={() => setShowChat(!showChat)}
      >
        <MessageSquare className="w-6 h-6" />
      </Button>

      {showChat && (
        <div className="fixed inset-x-4 bottom-24 z-40 lg:hidden">
          <Card variant="default" className="overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Bot className="h-4 w-4 text-primary" />
                AI Shopping Assistant
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChatInterface />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
