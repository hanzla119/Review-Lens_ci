#!/usr/bin/env python3
"""
Ethical listing scraper template for Review Lens regional datasets.

Targets:
- Daraz category/search pages (dynamic pages often expose product cards/selectors)
- Goto.com.pk category pages
- Public Shopify /products.json feeds

Use responsibly:
- Check robots.txt and terms of service before scraping.
- Keep request rates low.
- Prefer official APIs or public datasets when available.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; ReviewLensFYP/1.0; "
        "+https://github.com/ahmad259-git/Review-Lens)"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


@dataclass
class ReviewLensProduct:
    source_platform: str
    source_url: str
    collected_at: str
    title: str
    product_url: str
    current_price: float | None = None
    original_price: float | None = None
    discount_percentage: float | None = None
    currency: str = "PKR"
    brand: str | None = None
    category: str | None = None
    description: str | None = None
    images: list[str] = field(default_factory=list)
    specifications: dict[str, Any] = field(default_factory=dict)
    rating: float | None = None
    review_count: int | None = None
    raw_reviews: list[dict[str, Any]] = field(default_factory=list)


def fetch_html(url: str, timeout: int = 20) -> str:
    response = requests.get(url, headers=HEADERS, timeout=timeout)
    response.raise_for_status()
    return response.text


def parse_price(value: str | None) -> float | None:
    if not value:
        return None

    cleaned = re.sub(r"[^\d.]", "", value.replace(",", ""))
    if not cleaned:
        return None

    try:
        return float(cleaned)
    except ValueError:
        return None


def calculate_discount(current: float | None, original: float | None) -> float | None:
    if not current or not original or original <= current:
        return None
    return round(((original - current) / original) * 100, 2)


def text_or_none(node) -> str | None:
    if not node:
        return None
    text = node.get_text(" ", strip=True)
    return text or None


def first_attr(node, *attributes: str) -> str | None:
    if not node:
        return None
    for attr in attributes:
        value = node.get(attr)
        if value:
            return value
    return None


def parse_json_ld_products(soup: BeautifulSoup, page_url: str, platform: str) -> list[ReviewLensProduct]:
    products: list[ReviewLensProduct] = []
    collected_at = datetime.now(timezone.utc).isoformat()

    for script in soup.select('script[type="application/ld+json"]'):
        try:
            payload = json.loads(script.string or "{}")
        except json.JSONDecodeError:
            continue

        records = payload if isinstance(payload, list) else [payload]
        for record in records:
            candidates = record.get("@graph", [record]) if isinstance(record, dict) else []
            for item in candidates:
                item_type = item.get("@type") if isinstance(item, dict) else None
                is_product = item_type == "Product" or (
                    isinstance(item_type, list) and "Product" in item_type
                )
                if not isinstance(item, dict) or not is_product:
                    continue

                offers = item.get("offers") or {}
                if isinstance(offers, list):
                    offers = offers[0] if offers else {}

                image = item.get("image")
                images = image if isinstance(image, list) else [image] if image else []

                current_price = parse_price(str(offers.get("price") or ""))
                products.append(
                    ReviewLensProduct(
                        source_platform=platform,
                        source_url=page_url,
                        collected_at=collected_at,
                        title=item.get("name") or "",
                        product_url=urljoin(page_url, item.get("url") or page_url),
                        current_price=current_price,
                        currency=offers.get("priceCurrency") or "PKR",
                        brand=(item.get("brand") or {}).get("name")
                        if isinstance(item.get("brand"), dict)
                        else item.get("brand"),
                        description=item.get("description"),
                        images=[urljoin(page_url, src) for src in images if src],
                    )
                )

    return [product for product in products if product.title]


def parse_daraz_listing(html: str, page_url: str) -> list[ReviewLensProduct]:
    soup = BeautifulSoup(html, "html.parser")
    products = parse_json_ld_products(soup, page_url, "Daraz")
    collected_at = datetime.now(timezone.utc).isoformat()

    card_selectors = [
        "[data-qa-locator='product-item']",
        ".gridItem--Yd0sa",
        ".Bm3ON",
    ]

    for selector in card_selectors:
        for card in soup.select(selector):
            title_node = card.select_one("a[title], .title--wFj93, .RfADt a, .info--ifj7U a")
            price_node = card.select_one(".price--NVB62, .ooOxS, .aBrP0")
            original_node = card.select_one(".origPrice--AJxRs, .IcOsH, del")
            image_node = card.select_one("img")
            link_node = card.select_one("a[href]")

            title = first_attr(title_node, "title") or text_or_none(title_node)
            if not title:
                continue

            current_price = parse_price(text_or_none(price_node))
            original_price = parse_price(text_or_none(original_node))
            products.append(
                ReviewLensProduct(
                    source_platform="Daraz",
                    source_url=page_url,
                    collected_at=collected_at,
                    title=title,
                    product_url=urljoin(page_url, first_attr(link_node, "href") or page_url),
                    current_price=current_price,
                    original_price=original_price,
                    discount_percentage=calculate_discount(current_price, original_price),
                    currency="PKR",
                    images=[
                        urljoin(page_url, src)
                        for src in [first_attr(image_node, "src", "data-src")]
                        if src
                    ],
                )
            )

    return dedupe_products(products)


def parse_goto_listing(html: str, page_url: str) -> list[ReviewLensProduct]:
    soup = BeautifulSoup(html, "html.parser")
    products = parse_json_ld_products(soup, page_url, "Goto.com.pk")
    collected_at = datetime.now(timezone.utc).isoformat()

    card_selectors = [
        ".product-layout",
        ".product-thumb",
        ".product-item",
        "[class*='product']",
    ]

    for selector in card_selectors:
        for card in soup.select(selector):
            title_node = card.select_one("h4 a, .caption a, .name a, a[title]")
            price_node = card.select_one(".price-new, .price, [class*='price']")
            original_node = card.select_one(".price-old, del")
            image_node = card.select_one("img")
            link_node = card.select_one("a[href]")

            title = first_attr(title_node, "title") or text_or_none(title_node)
            if not title or len(title) < 3:
                continue

            current_price = parse_price(text_or_none(price_node))
            original_price = parse_price(text_or_none(original_node))
            products.append(
                ReviewLensProduct(
                    source_platform="Goto.com.pk",
                    source_url=page_url,
                    collected_at=collected_at,
                    title=title,
                    product_url=urljoin(page_url, first_attr(link_node, "href") or page_url),
                    current_price=current_price,
                    original_price=original_price,
                    discount_percentage=calculate_discount(current_price, original_price),
                    currency="PKR",
                    images=[
                        urljoin(page_url, src)
                        for src in [first_attr(image_node, "src", "data-src")]
                        if src
                    ],
                )
            )

    return dedupe_products(products)


def scrape_shopify_products(url: str) -> list[ReviewLensProduct]:
    endpoint = url.rstrip("/") + "/products.json"
    response = requests.get(endpoint, headers=HEADERS, timeout=20)
    response.raise_for_status()
    payload = response.json()
    collected_at = datetime.now(timezone.utc).isoformat()
    products: list[ReviewLensProduct] = []

    for item in payload.get("products", []):
        variants = item.get("variants") or []
        first_variant = variants[0] if variants else {}
        current_price = parse_price(str(first_variant.get("price") or ""))
        original_price = parse_price(str(first_variant.get("compare_at_price") or ""))
        handle = item.get("handle") or ""

        products.append(
            ReviewLensProduct(
                source_platform="Shopify",
                source_url=endpoint,
                collected_at=collected_at,
                title=item.get("title") or "",
                product_url=urljoin(url, f"/products/{handle}") if handle else url,
                current_price=current_price,
                original_price=original_price,
                discount_percentage=calculate_discount(current_price, original_price),
                currency="USD",
                brand=item.get("vendor"),
                category=item.get("product_type"),
                description=BeautifulSoup(item.get("body_html") or "", "html.parser").get_text(" ", strip=True),
                images=[image.get("src") for image in item.get("images", []) if image.get("src")],
                specifications={"tags": item.get("tags", [])},
            )
        )

    return dedupe_products(products)


def dedupe_products(products: list[ReviewLensProduct]) -> list[ReviewLensProduct]:
    seen: set[tuple[str, str]] = set()
    unique: list[ReviewLensProduct] = []
    for product in products:
        key = (product.title.lower(), product.product_url)
        if key in seen:
            continue
        seen.add(key)
        unique.append(product)
    return unique


def scrape_url(url: str, platform: str, delay: float) -> list[ReviewLensProduct]:
    time.sleep(delay)

    if platform == "shopify":
        return scrape_shopify_products(url)

    html = fetch_html(url)
    if platform == "daraz":
        return parse_daraz_listing(html, url)
    if platform == "goto":
        return parse_goto_listing(html, url)

    raise ValueError(f"Unsupported platform: {platform}")


def write_output(products: list[ReviewLensProduct], output_path: str) -> None:
    rows = [asdict(product) for product in products]

    if output_path.endswith(".csv"):
        flattened = []
        for row in rows:
            flattened.append(
                {
                    **row,
                    "images": json.dumps(row["images"], ensure_ascii=False),
                    "specifications": json.dumps(row["specifications"], ensure_ascii=False),
                    "raw_reviews": json.dumps(row["raw_reviews"], ensure_ascii=False),
                }
            )
        pd.DataFrame(flattened).to_csv(output_path, index=False, quoting=csv.QUOTE_MINIMAL)
        return

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(rows, file, ensure_ascii=False, indent=2)


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape regional e-commerce listings for Review Lens.")
    parser.add_argument("--platform", choices=["daraz", "goto", "shopify"], required=True)
    parser.add_argument("--url", action="append", required=True, help="Category/store URL. Can be passed multiple times.")
    parser.add_argument("--output", default="review_lens_scrape.json", help="Output file (.json or .csv)")
    parser.add_argument("--delay", type=float, default=1.5, help="Delay between requests in seconds")
    args = parser.parse_args()

    all_products: list[ReviewLensProduct] = []
    for url in args.url:
        all_products.extend(scrape_url(url, args.platform, args.delay))

    write_output(dedupe_products(all_products), args.output)
    print(f"Saved {len(all_products)} records to {args.output}")


if __name__ == "__main__":
    main()
