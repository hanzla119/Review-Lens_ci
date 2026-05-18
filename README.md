# Review Lens

Review Lens is an AI-powered e-commerce insights platform for comparing products,
prices, ratings, and customer sentiment across multiple shopping sources. The frontend
is built as a modern product discovery dashboard with a conversational AI assistant.

## Core project modules

- **Frontend dashboard:** React, TypeScript, Tailwind CSS, shadcn-style components, and Recharts.
- **Backend APIs:** Node.js and Express REST endpoints for products, search, sentiment, and chatbot requests.
- **Database:** MongoDB with Mongoose for product listings, reviews, sentiment results, and chat history.
- **Scraping pipeline:** Python with Requests, BeautifulSoup/Scrapy, and Pandas for collecting and cleaning product data.
- **AI/NLP layer:** Rasa/spaCy/NLTK or similar models for chatbot intent detection and review sentiment analysis.

## Frontend features

- Professional light e-commerce design system.
- Product listing cards with price, discount, platform, rating, and sentiment score.
- Dashboard filters for search, category, and source platform.
- Recharts-based sentiment and platform analytics.
- Product detail modal with price history and sample review sentiment.
- AI shopping assistant interface for natural-language product discovery.
- Login, signup, OTP email verification, Google authentication, and persistent auth state.
- Dataset catalog page at `/datasets` with recommended public sources for electronics data.

## Authentication backend

The repository now includes a Node.js/Express authentication API under `server/src`.

Implemented endpoints:

- `GET /api/products`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Note: endpoints such as `/api/auth/send-otp` must be called with `POST` from the
signup form or an API client. Opening that URL directly in the browser sends `GET`,
so the server returns a method guidance message instead of sending an OTP.

Security features:

- Password hashing with bcrypt.
- JWT session token returned to the frontend and also stored in an HTTP-only cookie.
- MongoDB user persistence with unique email protection.
- OTP hashes stored server-side with expiry and attempt limits.
- Google ID token verification with Google Identity Services.
- Auth middleware for protected routes.

## Environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Important values:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL` (this Vite project uses `http://localhost:8080` by default)
- `CLIENT_URLS` for extra allowed frontend origins, comma-separated
- `GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_API_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` for real OTP emails

If SMTP values are omitted during development, OTP codes are printed in the backend
console for local testing only.

If the signup page shows `Failed to fetch`, check that the browser URL is included
in `CLIENT_URL` or `CLIENT_URLS`. The frontend in `vite.config.ts` runs on port
`8080`, so `CLIENT_URL=http://localhost:8080` is the safest default.

## Local development

```bash
npm i
```

Run the backend API:

```bash
npm run server:dev
```

Run the frontend in a separate terminal:

```bash
npm run dev
```

## Dataset research and scraping

Dataset source notes are maintained in:

```text
docs/datasets.md
src/data/datasetSources.ts
```

Sample normalized records are included at:

```text
data/samples/review_lens_products_sample.json
```

Install optional Python scraper dependencies:

```bash
pip install -r requirements-data.txt
```

Example regional scrape commands:

```bash
python scripts/scrapers/south_asia_ecommerce_scraper.py \
  --platform daraz \
  --url "https://www.daraz.pk/smartphones/" \
  --output daraz_smartphones.json

python scripts/scrapers/south_asia_ecommerce_scraper.py \
  --platform goto \
  --url "https://www.goto.com.pk/computing-gaming" \
  --output goto_computing_gaming.csv
```

Always check the target website terms of service and robots.txt before scraping.

The dashboard loads product cards from:

```text
GET /api/products?limit=24
```

The backend first loads `data/samples/review_lens_products_sample.json` (local normalized
catalog), then optionally supplements it from the Hugging Face
`gatech-scheller-ai-in-business/amazon-products` dataset when pagination moves beyond local
records. The final API response is normalized into the Review Lens product-card schema.

## Build

```bash
npm run build
```
