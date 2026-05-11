import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Search, ShieldCheck, TrendingDown } from "lucide-react";

const Chatbot = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="marketplace-surface px-4 pb-12 pt-28">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Badge variant="secondary" className="mb-4">Conversational product discovery</Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Ask natural shopping questions and get focused recommendations.
              </h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                The chatbot is designed for queries like budget searches, price comparisons,
                sentiment checks, and product recommendations from the Review Lens database.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Search, title: "Intent search", text: "Find products by category and budget." },
                { icon: ShieldCheck, title: "Sentiment aware", text: "Use review polarity in decisions." },
                { icon: TrendingDown, title: "Deal context", text: "Compare pricing and recent drops." },
              ].map((item) => (
                <Card key={item.title} variant="default">
                  <CardContent className="p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-3 shadow-xl shadow-primary/10 md:p-5">
            <div className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold text-muted-foreground">
              <MessageSquare className="h-4 w-4 text-primary" />
              Example: "Show me headphones under PKR 30,000 with positive reviews."
            </div>
            <ChatInterface fullPage />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
