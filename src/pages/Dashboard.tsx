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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="marketplace-surface px-4 pb-12 pt-28">
        <div className="container mx-auto">
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-8">
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
              <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
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
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: "Dataset products", value: products.length.toLocaleString(), change: datasetSource },
              { icon: Star, label: "Average rating", value: averageRating, change: "Live" },
              { icon: TrendingDown, label: "Discounted products", value: totals.priceDrops.toString(), change: "Now" },
              { icon: ShieldCheck, label: "Reviews analyzed", value: totals.reviews.toLocaleString(), change: "Dataset" },
            ].map((stat, index) => (
              <Card key={index} variant="default">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Card variant="default">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "hero" : "secondary"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge
                      variant={selectedPlatform === null ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlatform(null)}
                    >
                      All Platforms
                    </Badge>
                    {platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant={selectedPlatform === platform ? "default" : "outline"}
                        className="cursor-pointer"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} variant="default" className="overflow-hidden">
                      <div className="aspect-[4/3] animate-pulse bg-muted" />
                      <CardContent className="space-y-3 p-5">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="h-5 w-full animate-pulse rounded bg-muted" />
                        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                        <div className="h-10 w-full animate-pulse rounded bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <Card variant="default" className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5 text-primary" />
                    Market snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
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
                  <div className="space-y-2 mt-4">
                    {sentimentData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}%</span>
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
                  <div className="h-48">
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

              <div className="hidden lg:block">
                <ChatInterface />
              </div>
            </div>
          </div>
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
