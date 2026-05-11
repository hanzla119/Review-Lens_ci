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

## Local development

```bash
npm i
npm run dev
```

## Build

```bash
npm run build
```
