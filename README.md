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

## Authentication backend

The repository now includes a Node.js/Express authentication API under `server/src`.

Implemented endpoints:

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`

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
- `CLIENT_URL`
- `GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_API_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` for real OTP emails

If SMTP values are omitted during development, OTP codes are printed in the backend
console for local testing only.

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

## Build

```bash
npm run build
```
