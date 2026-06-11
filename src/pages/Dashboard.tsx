import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const DASHBOARD_PRODUCT_LIMIT = 10000;
const INITIAL_VISIBLE_PRODUCTS = 80;
const PRODUCTS_PER_BATCH = 80;

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-4">
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
  const [visibleProductsCount, setVisibleProductsCount] = useState(INITIAL_VISIBLE_PRODUCTS);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductError("");

      try {
        const response = await productsApi.list(DASHBOARD_PRODUCT_LIMIT);
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
    () => {
      const prettify = (raw?: string) => {
        if (!raw) return "";
        const s = raw.toLowerCase();
        const mapping: Array<[string, string]> = [
          ["laptop", "Laptop"],
          ["smartwatch", "Smartwatch"],
          ["smartphone", "Phone"],
          ["phone", "Phone"],
          ["camera", "Camera"],
          ["remote", "Remote Control"],
          ["cable", "Cable"],
          ["charger", "Charger"],
          ["headphone", "Headphones"],
          ["printer", "Printer"],
          ["ink", "Ink"],
          ["accessories", "Accessories"],
          ["case", "Case"],
          ["tablet", "Tablet"],
        ];

        for (const [k, label] of mapping) {
          if (s.includes(k)) return label;
        }

        // Remove trailing numeric ids and replace underscores, then title case
        const cleaned = raw.replace(/_[0-9]+$/g, "").replace(/_/g, " ").trim();
        const titled = cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
        return titled.length > 24 ? `${titled.slice(0, 21)}...` : titled;
      };

      const values = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
      return [
        { value: "All", label: "All" },
        ...values.map((v) => ({ value: v, label: prettify(v) })),
      ];
    },
    [products],
  );

  const platforms = useMemo(
    () => Array.from(new Set(products.map((product) => product.platform).filter(Boolean))),
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesPlatform = !selectedPlatform || product.platform === selectedPlatform;
        return matchesSearch && matchesCategory && matchesPlatform;
      }).sort((a, b) => {
        const aHasImage = a.image && a.image !== "/placeholder.svg" ? 1 : 0;
        const bHasImage = b.image && b.image !== "/placeholder.svg" ? 1 : 0;
        return bHasImage - aHasImage;
      }),
    [products, searchQuery, selectedCategory, selectedPlatform],
  );

  useEffect(() => {
    setVisibleProductsCount(INITIAL_VISIBLE_PRODUCTS);
  }, [searchQuery, selectedCategory, selectedPlatform, products.length]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleProductsCount),
    [filteredProducts, visibleProductsCount],
  );

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
                  Products with price, rating, and sentiment clarity.
                </h1>
                <p className="mt-4 max-w-3xl text-muted-foreground">
                  Search products fetched from public e-commerce websites, filter by category
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

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Package, label: "Products", value: products.length.toLocaleString(), change: datasetSource },
              { icon: Star, label: "Average rating", value: averageRating, change: "Live" },
              { icon: TrendingDown, label: "Discounted products", value: totals.priceDrops.toString(), change: "Now" },
              { icon: ShieldCheck, label: "Reviews analyzed", value: totals.reviews.toLocaleString(), change: "Dataset" },
            ].map((stat, index) => (
              <Card key={index} variant="default" className="h-full">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold truncate">{stat.value}</div>
                    <div className="text-xs font-medium text-muted-foreground truncate">{stat.label}</div>
                    <Badge variant="success" className="text-xs mt-1 truncate">{stat.change}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <Card variant="default">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overall Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 md:h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={32}
                        outerRadius={56}
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
                <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                  {sentimentData.map((item) => (
                    <div key={item.name} className="rounded-lg bg-muted/60 p-1 text-center">
                      <div className="mx-auto mb-0.5 h-1.5 w-6 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="font-semibold text-xs">{item.name}</p>
                      <p className="text-muted-foreground text-xs">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="default">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Products by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 md:h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={platformData}
                      layout="vertical"
                      margin={{ left: 120, right: 12, top: 8, bottom: 8 }}
                    >
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        interval={0}
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        tickLine={false}
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

          <section className="space-y-4">
            <Card variant="default" className="sticky top-24 z-20 border-primary/10 bg-white/95 backdrop-blur">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 py-2 h-9 text-sm"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 bg-white h-9"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-2">
                        <p className="text-sm font-semibold mb-2">Category</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {categories.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category.value}
                              checked={selectedCategory === category.value}
                              onCheckedChange={() => setSelectedCategory(category.value)}
                            >
                              {category.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      <div className="px-2 py-2">
                        <p className="text-sm font-semibold mb-2">Platform</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          <DropdownMenuCheckboxItem
                            checked={selectedPlatform === null}
                            onCheckedChange={() => setSelectedPlatform(null)}
                          >
                            All Platforms
                          </DropdownMenuCheckboxItem>
                          {platforms.map((platform) => (
                            <DropdownMenuCheckboxItem
                              key={platform}
                              checked={selectedPlatform === platform}
                              onCheckedChange={() => setSelectedPlatform(platform)}
                            >
                              {platform}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      <div className="px-2 py-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={resetFilters}
                          className="w-full text-xs h-8"
                        >
                          Reset All Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-xl font-bold">Products</h2>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} items
                </p>
              </div>
              <Badge variant="accent" className="w-fit text-xs">
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
              <>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-4">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
                {visibleProducts.length < filteredProducts.length && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setVisibleProductsCount((current) =>
                          Math.min(current + PRODUCTS_PER_BATCH, filteredProducts.length),
                        )
                      }
                    >
                      Load more products ({visibleProducts.length.toLocaleString()} /{" "}
                      {filteredProducts.length.toLocaleString()})
                    </Button>
                  </div>
                )}
              </>
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
