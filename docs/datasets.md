# Review Lens Dataset Catalog

This document records public datasets and practical acquisition routes for the Review
Lens Final Year Project. The strongest open dataset for electronics reviews is Amazon
Reviews 2023. Regional/local platforms such as Daraz and Goto have weaker public
coverage, so Review Lens should combine public datasets with ethical scheduled
scraping/API collection.

## Recommended datasets

| Platform | Dataset / Source | Link | Last updated / version note | Format | Why it fits Review Lens |
| --- | --- | --- | --- | --- | --- |
| Amazon | Amazon Reviews 2023 | https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023 | April 7, 2024 metadata utility update; interactions through Sep 2023 | JSONL.GZ / Hugging Face Parquet | Best primary corpus: Electronics has about 43.9M ratings, product metadata, prices, images, review text, timestamps, and helpful votes. |
| Amazon | Amazon Products Sample Dataset | https://huggingface.co/datasets/gatech-scheller-ai-in-business/amazon-products | Derived from Amazon Reviews 2023 / 2024 paper | Parquet | Small 2,010-row teaching dataset with 500 electronics products, prices, descriptions, features, ratings, and images. |
| Amazon | Amazon Best-Selling Electronics Dataset 2025 | https://www.kaggle.com/datasets/senkumaster/amazon-best-selling-electronics-dataset-2025 | 2025 Kaggle dataset; verify exact revision in Kaggle UI | CSV | Fresh listing snapshot for product catalog/price fields. |
| eBay | eBay Product Listing Dataset | https://www.kaggle.com/datasets/promptcloud/ebay-product-listing-dataset/data | Kaggle public listing; exact revision not visible in unauthenticated search | CSV | Product listing and price comparison source; review text is usually absent. |
| eBay | eBay iPhone Pricing Trends 2023 | https://www.kaggle.com/datasets/kanchana1990/ebay-iphone-pricing-trends-2023 | 2023 dataset; verify exact revision in Kaggle UI | CSV | Useful for smartphone resale/historical price trend examples. |
| AliExpress | AliExpress Product Reviews | https://www.kaggle.com/datasets/mohammedderouiche/aliexpress-product-reviews | 2024, source notes coverage through Apr 23, 2024 | CSV | Recent global marketplace review corpus for sentiment analysis. |
| Alibaba | Alibaba Scraper | https://apify.com/scraper-engine/alibaba-scraper | Live scraper; run date is dataset version | JSON / CSV export | Public static Alibaba datasets are weak; scraper/API collection is better for supplier, MOQ, price range, image, and rating fields. |
| Shopify | Public Shopify product JSON feeds | https://shopify.dev/docs/api/ajax/reference/product | Live endpoint; run date is dataset version | JSON | Many Shopify stores expose `/products.json`; reviews usually require app-specific APIs such as Judge.me/Yotpo/Loox. |
| Daraz | Daraz SmartPhone Web Data Scrape | https://www.kaggle.com/datasets/akibuddinnayan/daraz-smartphone-web-data-scrape/data | Kaggle public listing; exact revision not visible in unauthenticated search | CSV | Strong regional smartphone product/price seed dataset. |
| Daraz | Daraz Code Mixed Product Reviews | https://www.kaggle.com/datasets/yrrebeere/daraz-code-mixed-product-reviews | Public dataset mirrors; OpenDataBay summary reports 16,990 reviews | CSV | Best local NLP option for English/Roman Urdu/Urdu sentiment. |
| Goto.com.pk | Custom scraper route | https://www.goto.com.pk/computing-gaming | No reliable public dataset found | JSON / CSV generated locally | Use `scripts/scrapers/south_asia_ecommerce_scraper.py` for local electronics price/listing collection. |
| Cross-platform | Electronic Products and Pricing Data | https://www.kaggle.com/datasets/datafiniti/electronic-products-prices/data | Kaggle public listing; verify exact revision in Kaggle UI | CSV | General electronics pricing/product attribute normalization dataset. |
| South Asian alternative | Flipkart Product Review Dataset | https://www.kaggle.com/datasets/mansithummar67/flipkart-product-review-dataset | Kaggle public listing; verify exact revision in Kaggle UI | CSV | Useful regional fallback with product name, price, review, rating, and summary fields. |
| UCI / PriceRunner | Product Classification and Clustering | https://archive.ics.uci.edu/dataset/837/product+classification+and+clustering | Donated Aug 6, 2023 | CSV | Product matching/clustering dataset for deduplicating cross-platform product offers. |

## Review Lens normalized product schema

Use this schema when importing any source into MongoDB:

```json
{
  "source_platform": "Amazon",
  "source_dataset": "McAuley-Lab/Amazon-Reviews-2023",
  "source_url": "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023",
  "product_id": "B0EXAMPLE01",
  "title": "Wireless Noise Cancelling Headphones",
  "brand": "Example Audio",
  "category": "Electronics > Headphones",
  "description": "Product description",
  "images": ["https://example.com/image.jpg"],
  "product_url": "https://example.com/product",
  "specifications": {
    "battery_life": "30 hours"
  },
  "pricing": {
    "current_price": 29990,
    "original_price": 34990,
    "discount_percentage": 14.29,
    "currency": "PKR",
    "history": [
      { "date": "2026-01-01", "price": 34990 }
    ]
  },
  "reviews": [
    {
      "reviewer_name": "anonymous_user_001",
      "rating": 5,
      "review_text": "Excellent product.",
      "timestamp": "2026-03-14T10:15:00Z",
      "helpful_votes": 12,
      "sentiment": "positive"
    }
  ]
}
```

Sample records are included at:

```text
data/samples/review_lens_products_sample.json
```

## Practical acquisition plan

1. Use Amazon Reviews 2023 as the primary review + metadata corpus.
2. Use Daraz code-mixed reviews for local sentiment model evaluation.
3. Use Daraz/Goto scheduled scrapes for live Pakistani price and availability.
4. Use eBay/Datafiniti/PriceRunner datasets for product matching and price comparison.
5. Store every import with source name, source URL, collection date, and raw record hash.
