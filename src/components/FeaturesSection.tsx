import { Card, CardContent } from "@/components/ui/card";
import { features } from "@/data/mockData";

const FeaturesSection = () => {
  return (
    <section className="relative bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-primary">Platform capabilities</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Built for product discovery, trust, and analytics
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Review Lens combines a familiar e-commerce browsing experience with the
            intelligence expected from an academic AI and data analytics project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="interactive" 
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold font-display mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
