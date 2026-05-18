# FastLube — Frontend (React)

React app. Deploy this folder **by itself** to Netlify, Vercel, or GitHub Pages.

## Local setup

```bash
cd frontend
npm install
npm start
```

Runs at **http://localhost:3000** and proxies `/api` to the backend on port 5000.

Start the **backend** first (`cd ../backend && npm run dev`).

## Production build

```bash
# Set your live API URL before building
REACT_APP_API_URL=https://your-api.onrender.com npm run build
```

On Windows (PowerShell):

```powershell
$env:REACT_APP_API_URL="https://your-api.onrender.com"
npm run build
```

## Free deploy (Netlify)

1. [netlify.com](https://netlify.com) → **Add new site** → Import from Git.
2. **Base directory:** `frontend`
3. **Build command:** `npm run build`
4. **Publish directory:** `frontend/build`
5. **Environment variables:** `REACT_APP_API_URL` = your backend URL (no trailing slash).

`netlify.toml` and `public/_redirects` are included for SPA routing.

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for Vercel, GitHub Pages, and other hosts.
