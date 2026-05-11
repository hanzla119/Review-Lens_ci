import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, Search, ShieldCheck, Sparkles, Star, TrendingDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="marketplace-surface relative overflow-hidden pt-28">
      <div className="soft-grid absolute inset-0 opacity-45" />
      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              AI-powered e-commerce insights for smarter buying
            </div>

            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Compare products, reviews, and prices in one trusted place.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Review Lens brings scraped product data, customer sentiment, price history,
              and conversational search into a polished dashboard for shoppers, sellers,
              and market researchers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Explore Products
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/chatbot">Ask AI Assistant</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, text: "Sentiment-scored reviews" },
                { icon: TrendingDown, text: "Price trend tracking" },
                { icon: BadgeCheck, text: "Cross-platform results" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white/80 p-4 text-sm font-medium shadow-sm backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-6 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-2xl shadow-primary/10">
              <div className="mb-5 flex items-center justify-between rounded-2xl bg-muted/70 p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Live product intelligence</p>
                  <p className="text-xs text-muted-foreground">Amazon, Daraz, Shopify and more</p>
                </div>
                <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">Online</div>
              </div>

              <div className="rounded-3xl border border-border bg-gradient-to-br from-white to-secondary/70 p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Best match</p>
                    <h3 className="mt-2 text-2xl font-bold">Sony WH-1000XM5 Headphones</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Noise cancelling audio with strong review confidence.</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="mb-5 aspect-[16/10] overflow-hidden rounded-2xl bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900"
                    alt="Premium headphones"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground">Current price</p>
                    <p className="mt-1 text-lg font-bold text-primary">PKR 29,990</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="mt-1 flex items-center gap-1 text-lg font-bold">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      4.7
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-muted-foreground">Positive</p>
                    <p className="mt-1 text-lg font-bold text-success">78%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 rounded-[2rem] border border-border bg-white/85 p-5 shadow-sm backdrop-blur md:grid-cols-4">
          {[
            { value: "50K+", label: "Products analyzed" },
            { value: "5M+", label: "Reviews processed" },
            { value: "3", label: "Core AI modules" },
            { value: "10+", label: "Supported platforms" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-muted/60 p-5 text-center">
              <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
