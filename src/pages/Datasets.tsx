import { ExternalLink, FileJson, Search, ShieldCheck, TableProperties } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { datasetCoverageStats, datasetSources } from "@/data/datasetSources";

const coverageVariant = (coverage: string) => {
  if (coverage === "Excellent") return "success";
  if (coverage === "Good") return "default";
  if (coverage === "Scrape/API recommended") return "warning";
  return "outline";
};

const Datasets = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="marketplace-surface px-4 pb-16 pt-28">
        <div className="container mx-auto">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-border bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Data engineering roadmap
                </Badge>
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                  Public electronics datasets and scraping sources for Review Lens.
                </h1>
                <p className="mt-4 max-w-3xl text-muted-foreground">
                  This catalog maps Amazon, eBay, AliExpress, Alibaba, Shopify,
                  Daraz, and Goto data sources to the product, pricing, review, and
                  sentiment fields needed by the Review Lens dashboard.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-secondary p-4 text-center">
                  <p className="font-display text-3xl font-bold text-primary">{datasetCoverageStats.totalSources}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Sources</p>
                </div>
                <div className="rounded-2xl bg-success/10 p-4 text-center">
                  <p className="font-display text-3xl font-bold text-success">{datasetCoverageStats.strongReviewSources}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Strong fits</p>
                </div>
                <div className="rounded-2xl bg-warning/10 p-4 text-center">
                  <p className="font-display text-3xl font-bold text-warning">{datasetCoverageStats.scraperRecommendedSources}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Scrape/API</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: TableProperties,
                title: "Normalize first",
                text: "Map every source into one product schema before inserting into MongoDB.",
              },
              {
                icon: ShieldCheck,
                title: "Respect source rules",
                text: "Prefer public datasets/APIs. For scraping, follow robots.txt, rate limits, and terms.",
              },
              {
                icon: FileJson,
                title: "Version every import",
                text: "Store source, collection date, and raw URL so dashboard insights are traceable.",
              },
            ].map((item) => (
              <Card key={item.title} variant="default">
                <CardContent className="p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-xl font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6">
            {datasetSources.map((source) => (
              <Card key={`${source.platform}-${source.title}`} variant="default">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">{source.platform}</Badge>
                        <Badge variant={coverageVariant(source.coverage)}>{source.coverage}</Badge>
                        <Badge variant="outline">{source.sourceType}</Badge>
                      </div>
                      <CardTitle className="text-2xl leading-tight">{source.title}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">{source.fitSummary}</p>
                    </div>
                    <Button variant="outline" asChild>
                      <a href={source.sourceLink} target="_blank" rel="noreferrer">
                        Open source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-muted/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Last updated</p>
                      <p className="mt-1 text-sm font-semibold">{source.lastUpdated}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Format</p>
                      <p className="mt-1 text-sm font-semibold">{source.dataFormat}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Category focus</p>
                      <p className="mt-1 text-sm font-semibold">{source.categoryFocus}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                        <Search className="h-4 w-4 text-primary" />
                        Fields available
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {source.mandatoryFields.map((field) => (
                          <Badge key={field} variant="glass">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-bold">Known gaps</p>
                      <div className="flex flex-wrap gap-2">
                        {source.missingFields.map((field) => (
                          <Badge key={field} variant="outline">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-primary/10 bg-secondary p-4 text-sm text-primary">
                      <span className="font-bold">Recommended use: </span>
                      {source.recommendedUse}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Datasets;
