import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-dark opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Shopping Intelligence</span>
          </div>
        </div>

        <h1 className="animate-slide-up text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-6 leading-tight">
          <span className="text-foreground">Shop Smarter with</span>
          <br />
          <span className="text-gradient glow-text">Review Lens</span>
        </h1>

        <p className="animate-slide-up text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10" style={{ animationDelay: "0.1s" }}>
          Compare prices, analyze reviews, and get AI-powered recommendations across 
          Amazon, Daraz, Shopify and more. Make confident purchasing decisions with 
          real-time sentiment analysis.
        </p>

        <div className="animate-slide-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: "0.2s" }}>
          <Button variant="hero" size="xl" asChild>
            <Link to="/dashboard">
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button variant="glass" size="xl" asChild>
            <Link to="/chatbot">
              Try AI Assistant
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="animate-slide-up grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto" style={{ animationDelay: "0.3s" }}>
          {[
            { value: "50K+", label: "Products Analyzed" },
            { value: "5M+", label: "Reviews Processed" },
            { value: "98%", label: "Accuracy Rate" },
            { value: "10+", label: "Platforms" },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl">
              <div className="text-3xl md:text-4xl font-bold font-display text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
