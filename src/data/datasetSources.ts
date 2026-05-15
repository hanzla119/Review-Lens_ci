export type DatasetCoverage = "Excellent" | "Good" | "Partial" | "Scrape/API recommended";

export interface DatasetSource {
  platform: string;
  title: string;
  sourceType: string;
  sourceLink: string;
  lastUpdated: string;
  dataFormat: string;
  categoryFocus: string;
  mandatoryFields: string[];
  missingFields: string[];
  coverage: DatasetCoverage;
  fitSummary: string;
  recommendedUse: string;
}

export const datasetSources: DatasetSource[] = [
  {
    platform: "Amazon",
    title: "Amazon Reviews 2023 - Electronics + Cell Phones and Accessories",
    sourceType: "Hugging Face / UCSD McAuley Lab",
    sourceLink: "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023",
    lastUpdated: "April 7, 2024 metadata utility update; interactions collected through September 2023",
    dataFormat: "JSONL.GZ direct downloads and Hugging Face Parquet configs",
    categoryFocus: "Electronics, Cell Phones and Accessories, Video Games, Appliances",
    mandatoryFields: [
      "title",
      "categories",
      "description",
      "features/specifications",
      "price",
      "images",
      "rating",
      "review text",
      "timestamp",
      "helpful_vote",
      "verified_purchase",
    ],
    missingFields: ["original price", "discount percentage", "historical price"],
    coverage: "Excellent",
    fitSummary:
      "Best core dataset for Review Lens: Electronics alone has about 18.3M users, 1.6M items, and 43.9M ratings with product metadata, images, prices, reviews, timestamps, and helpful votes.",
    recommendedUse:
      "Primary NLP/recommendation dataset. Join review files to metadata on parent_asin, then calculate sentiment and product insight scores.",
  },
  {
    platform: "Amazon",
    title: "Amazon Products Sample Dataset",
    sourceType: "Hugging Face",
    sourceLink: "https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products",
    lastUpdated: "Derived from Amazon Reviews 2023 / paper published March 6, 2024",
    dataFormat: "Hugging Face dataset / Parquet",
    categoryFocus: "500 Electronics products plus Video Games, Books, Home and Kitchen",
    mandatoryFields: [
      "title",
      "description",
      "price",
      "price_numeric",
      "average_rating",
      "rating_number",
      "features",
      "categories",
      "store",
      "images",
    ],
    missingFields: ["raw individual review text", "reviewer names", "historical prices"],
    coverage: "Good",
    fitSummary:
      "Small 2,010-row educational sample with 500 electronics products and rich metadata; easy to load for demos without downloading hundreds of GB.",
    recommendedUse: "Fast prototype dataset for MongoDB seeding, RAG product search, and UI demos.",
  },
  {
    platform: "Amazon",
    title: "Amazon Best-Selling Electronics Dataset 2025",
    sourceType: "Kaggle",
    sourceLink: "https://www.kaggle.com/datasets/senkumaster/amazon-best-selling-electronics-dataset-2025",
    lastUpdated: "2025 dataset page; exact Kaggle revision timestamp should be confirmed from a logged-in Kaggle session",
    dataFormat: "CSV",
    categoryFocus: "Best-selling Amazon electronics",
    mandatoryFields: ["product title", "category", "price/rank-style listing fields where available"],
    missingFields: ["raw reviews may be absent", "historical prices may be absent"],
    coverage: "Partial",
    fitSummary:
      "Useful as a fresh 2025 Amazon electronics listing snapshot, but Kaggle page metadata should be checked before using it as the main review corpus.",
    recommendedUse: "Supplement product catalog freshness and compare with the larger Amazon Reviews 2023 corpus.",
  },
  {
    platform: "eBay",
    title: "eBay Product Listing Dataset",
    sourceType: "Kaggle / PromptCloud",
    sourceLink: "https://www.kaggle.com/datasets/promptcloud/ebay-product-listing-dataset/data",
    lastUpdated: "Public Kaggle listing; exact revision date not exposed in unauthenticated search results",
    dataFormat: "CSV",
    categoryFocus: "eBay product listings across categories; filter electronics manually",
    mandatoryFields: ["product title", "listing URL", "price/listing attributes where available"],
    missingFields: ["raw reviews", "sentiment labels", "historical prices"],
    coverage: "Partial",
    fitSummary:
      "Good for price/listing comparison and marketplace diversity, but eBay public review text is not usually available in these listing datasets.",
    recommendedUse: "Use for price comparison and product matching; combine with Amazon/Daraz reviews for sentiment.",
  },
  {
    platform: "eBay",
    title: "eBay iPhone Pricing Trends 2023",
    sourceType: "Kaggle",
    sourceLink: "https://www.kaggle.com/datasets/kanchana1990/ebay-iphone-pricing-trends-2023",
    lastUpdated: "2023 dataset page; exact Kaggle revision timestamp should be confirmed on Kaggle",
    dataFormat: "CSV",
    categoryFocus: "iPhone resale/pricing trends",
    mandatoryFields: ["iPhone model/listing title", "price", "condition/time trend fields where available"],
    missingFields: ["broad electronics categories", "raw product reviews", "reviewer metadata"],
    coverage: "Partial",
    fitSummary:
      "Narrow but valuable for showing historical/second-hand electronics pricing behavior in Review Lens charts.",
    recommendedUse: "Use as an example historical price-trend dataset for smartphones.",
  },
  {
    platform: "AliExpress",
    title: "AliExpress Product Reviews",
    sourceType: "Kaggle / Mohammed Derouiche",
    sourceLink: "https://www.kaggle.com/datasets/mohammedderouiche/aliexpress-product-reviews",
    lastUpdated: "2024; source notes coverage through April 23, 2024",
    dataFormat: "CSV / scraped review dataset",
    categoryFocus: "AliExpress product reviews across product categories",
    mandatoryFields: ["review text", "ratings", "review metadata fields available in scrape"],
    missingFields: ["complete product specifications may be limited", "historical prices"],
    coverage: "Good",
    fitSummary:
      "Strong recent review corpus for multilingual/global marketplace sentiment analysis; pair with listing scrapes for prices and images.",
    recommendedUse: "Train/evaluate sentiment models and compare review language with Amazon/Daraz.",
  },
  {
    platform: "Alibaba",
    title: "Alibaba Product Data via Apify Alibaba Scraper",
    sourceType: "Apify scraper / API-style extraction",
    sourceLink: "https://apify.com/scraper-engine/alibaba-scraper",
    lastUpdated: "Live scraper source; run date becomes dataset version",
    dataFormat: "JSON / CSV export from Apify",
    categoryFocus: "Alibaba electronics, suppliers, bulk pricing, MOQ",
    mandatoryFields: ["title", "URL", "price/range", "images", "supplier", "ratings/reviews where available", "specifications"],
    missingFields: ["pre-labeled sentiment", "guaranteed historical prices"],
    coverage: "Scrape/API recommended",
    fitSummary:
      "Alibaba public downloadable datasets are weak; scraper/API collection is more reliable for current B2B electronics pricing and suppliers.",
    recommendedUse: "Use as a data acquisition route for seller/business-intelligence features.",
  },
  {
    platform: "Shopify stores",
    title: "Public Shopify Store Product Feeds",
    sourceType: "Store JSON endpoints / custom scraper",
    sourceLink: "https://shopify.dev/docs/api/ajax/reference/product",
    lastUpdated: "Live store feeds; run date becomes dataset version",
    dataFormat: "JSON from /products.json or /products/{handle}.js",
    categoryFocus: "Electronics Shopify stores when the store exposes public product JSON",
    mandatoryFields: ["title", "handle/URL", "vendor/brand", "product_type/category", "images", "variants", "prices", "description"],
    missingFields: ["reviews usually require third-party app APIs", "sentiment labels", "historical price"],
    coverage: "Scrape/API recommended",
    fitSummary:
      "Shopify has consistent product JSON endpoints, making product catalog extraction clean; reviews require Judge.me/Yotpo/Loox app-specific APIs if public.",
    recommendedUse: "Use for clean product catalog ingestion and price monitoring from selected electronics Shopify stores.",
  },
  {
    platform: "Daraz",
    title: "Daraz SmartPhone Web Data Scrape",
    sourceType: "Kaggle",
    sourceLink: "https://www.kaggle.com/datasets/akibuddinnayan/daraz-smartphone-web-data-scrape/data",
    lastUpdated: "Public Kaggle dataset; exact revision timestamp not exposed in unauthenticated search results",
    dataFormat: "CSV",
    categoryFocus: "Daraz smartphones",
    mandatoryFields: ["mobile/product title", "price", "ratings/reviews counters where available"],
    missingFields: ["complete raw review text may be absent", "historical prices"],
    coverage: "Good",
    fitSummary:
      "Highly relevant regional dataset for Pakistan/South Asia smartphone price and listing analysis.",
    recommendedUse: "Seed local smartphone products and compare regional prices against Amazon/eBay.",
  },
  {
    platform: "Daraz",
    title: "Daraz Code Mixed Product Reviews / Daraz Multilingual Sentiment Dataset",
    sourceType: "Kaggle / OpenDataBay mirrors",
    sourceLink: "https://www.kaggle.com/datasets/yrrebeere/daraz-code-mixed-product-reviews",
    lastUpdated: "Public dataset mirrors; OpenDataBay summary reports 16,990 reviews",
    dataFormat: "CSV",
    categoryFocus: "Daraz product reviews in English, Roman Urdu, Urdu/code-mixed text",
    mandatoryFields: ["raw review text", "sentiment labels where available", "ratings in some versions"],
    missingFields: ["product images", "full specifications", "historical prices"],
    coverage: "Good",
    fitSummary:
      "Best regional NLP dataset for Review Lens because local buyers often write Roman Urdu/Urdu-English code-mixed reviews.",
    recommendedUse: "Train/test multilingual sentiment analysis for Pakistani e-commerce reviews.",
  },
  {
    platform: "Goto.com.pk",
    title: "Goto.com.pk Electronics Scraper Template",
    sourceType: "Custom scraper included in this repository",
    sourceLink: "https://www.goto.com.pk/computing-gaming",
    lastUpdated: "No reliable public dataset found; run date becomes dataset version",
    dataFormat: "JSON / CSV generated by scripts/scrapers/south_asia_ecommerce_scraper.py",
    categoryFocus: "Pakistan electronics: phones, tablets, computing, gaming, TV/audio",
    mandatoryFields: ["title", "price", "image", "URL", "category/listing URL"],
    missingFields: ["reviews may not be publicly exposed", "historical prices require scheduled scraping"],
    coverage: "Scrape/API recommended",
    fitSummary:
      "No strong public Goto dataset was found, so scheduled scraping is the practical approach for regional coverage.",
    recommendedUse: "Run periodic crawls to build current Pakistani pricing and availability history.",
  },
  {
    platform: "Cross-platform electronics",
    title: "Electronic Products and Pricing Data",
    sourceType: "Kaggle / Datafiniti",
    sourceLink: "https://www.kaggle.com/datasets/datafiniti/electronic-products-prices/data",
    lastUpdated: "Public Kaggle listing; exact revision date should be verified on Kaggle",
    dataFormat: "CSV",
    categoryFocus: "Electronics products and prices",
    mandatoryFields: ["product name", "brand", "category", "prices", "merchant/source fields where available"],
    missingFields: ["raw reviews may be limited", "sentiment labels"],
    coverage: "Good",
    fitSummary:
      "Useful general electronics pricing dataset for product catalog normalization and price-comparison baselines.",
    recommendedUse: "Use for initial price analytics and product attribute normalization.",
  },
  {
    platform: "South Asian alternative",
    title: "Flipkart Product Review Dataset",
    sourceType: "Kaggle",
    sourceLink: "https://www.kaggle.com/datasets/mansithummar67/flipkart-product-review-dataset",
    lastUpdated: "Public Kaggle listing; exact revision date should be verified on Kaggle",
    dataFormat: "CSV",
    categoryFocus: "Indian e-commerce product reviews across categories; filter electronics",
    mandatoryFields: ["product name", "price", "customer review", "rating", "review summary"],
    missingFields: ["images", "complete specifications", "historical prices"],
    coverage: "Good",
    fitSummary:
      "Strong South Asian fallback when Daraz/Goto public review coverage is limited; useful for English/Indian-market sentiment work.",
    recommendedUse: "Augment regional NLP training and compare sentiment patterns across South Asian marketplaces.",
  },
  {
    platform: "PriceRunner / UCI",
    title: "Product Classification and Clustering",
    sourceType: "UCI Machine Learning Repository",
    sourceLink: "https://archive.ics.uci.edu/dataset/837/product+classification+and+clustering",
    lastUpdated: "Donated August 6, 2023",
    dataFormat: "CSV",
    categoryFocus: "35,311 product offers from 10 categories and 306 merchants",
    mandatoryFields: ["product title", "merchant ID", "cluster label", "category label"],
    missingFields: ["reviews", "images", "prices", "historical prices"],
    coverage: "Partial",
    fitSummary:
      "Not a review dataset, but valuable for entity matching/product deduplication research before comparing prices across platforms.",
    recommendedUse: "Train product matching/clustering logic for cross-platform product comparison.",
  },
];

export const datasetCoverageStats = {
  totalSources: datasetSources.length,
  strongReviewSources: datasetSources.filter((source) => source.coverage === "Excellent" || source.coverage === "Good").length,
  scraperRecommendedSources: datasetSources.filter((source) => source.coverage === "Scrape/API recommended").length,
};
