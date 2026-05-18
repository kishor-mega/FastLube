# FastLube — Backend (API)

Node.js + Express + MongoDB API. Deploy this folder **by itself** to Render, Railway, or similar.

## Local setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
```

API runs at **http://localhost:5000**  
Health check: **GET /api/health**

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret for signing tokens |
| `CLIENT_URL` | Yes (prod) | Deployed frontend URL for CORS |
| `PORT` | No | Default `5000` (Render sets this automatically) |
| `ALLOWED_ORIGINS` | No | Extra CORS origins, comma-separated |

## Free deploy (Render)

1. Push repo to GitHub.
2. [render.com](https://render.com) → **New Web Service** → connect repo.
3. **Root directory:** `backend`
4. **Build:** `npm install` · **Start:** `npm start`
5. Add env vars from `.env.example`.
6. Copy the live URL (e.g. `https://fastlube-api.onrender.com`) — use it as `REACT_APP_API_URL` on the frontend.

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full guide.
