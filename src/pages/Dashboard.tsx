import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, SlidersHorizontal, TrendingUp, Star, Package } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import ChatInterface from "@/components/ChatInterface";
import { mockProducts, categories, platforms, type Product } from "@/data/mockData";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showChat, setShowChat] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPlatform = !selectedPlatform || product.platform === selectedPlatform;
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  // Analytics data
  const sentimentData = [
    { name: "Positive", value: 78, color: "hsl(var(--success))" },
    { name: "Neutral", value: 14, color: "hsl(var(--warning))" },
    { name: "Negative", value: 8, color: "hsl(var(--destructive))" },
  ];

  const platformData = [
    { name: "Amazon", products: 45 },
    { name: "Daraz", products: 32 },
    { name: "Shopify", products: 28 },
    { name: "eBay", products: 18 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              Product <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Explore products, compare prices, and analyze sentiment across platforms
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Package, label: "Total Products", value: "2,847", change: "+12%" },
              { icon: Star, label: "Avg Rating", value: "4.6", change: "+0.2" },
              { icon: TrendingUp, label: "Price Drops", value: "156", change: "Today" },
              { icon: Search, label: "Searches", value: "8.2K", change: "+45%" },
            ].map((stat, index) => (
              <Card key={index} variant="glass">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-display">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <Badge variant="success" className="text-xs mt-1">{stat.change}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search & Filters */}
              <Card variant="glass">
                <CardContent className="p-4">
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
                    <Button variant="outline" className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                    </Button>
                  </div>

                  {/* Category Pills */}
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

                  {/* Platform Pills */}
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

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <Card variant="glass" className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sentiment Overview */}
              <Card variant="glass">
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

              {/* Platform Stats */}
              <Card variant="glass">
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
                          }}
                        />
                        <Bar dataKey="products" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Chat */}
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

      {/* Mobile Chat FAB */}
      <Button
        variant="hero"
        size="xl"
        className="fixed bottom-6 right-6 rounded-full lg:hidden shadow-2xl animate-pulse-glow"
        onClick={() => setShowChat(!showChat)}
      >
        <Search className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
