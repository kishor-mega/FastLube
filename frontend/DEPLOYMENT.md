# Frontend deployment

Deploy **only this `frontend/` folder** to Netlify, Vercel, or GitHub Pages.

## Prerequisites

Deploy the **backend** first and note its URL (e.g. `https://fastlube-api.onrender.com`).  
See [../backend/DEPLOYMENT.md](../backend/DEPLOYMENT.md).

---

## Netlify (free tier)

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**.
2. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
3. **Environment variables:**

   | Key | Value |
   |-----|--------|
   | `REACT_APP_API_URL` | Backend URL (**no** trailing slash) |

4. Deploy → copy site URL (e.g. `https://fastlube.netlify.app`).
5. Set backend `CLIENT_URL` to that URL → redeploy backend.

`netlify.toml` and `public/_redirects` handle SPA routing.

---

## Vercel (alternative)

1. [vercel.com](https://vercel.com) → **Add New Project** → import repo.
2. **Root Directory:** `frontend`
3. Framework: **Create React App**
4. Environment: `REACT_APP_API_URL` = backend URL.
5. Deploy → set backend `CLIENT_URL` to your Vercel URL.

`vercel.json` handles SPA routing.

---

## GitHub Pages (optional)

A workflow at `/.github/workflows/deploy-frontend.yml` (repo root — required by GitHub Actions) builds this folder and deploys to Pages.

Set repository secret `REACT_APP_API_URL` to your backend URL.

---

## Local development

```bash
cd frontend
npm install
npm start
```

Runs at **http://localhost:3000** (proxies `/api` to backend on port 5000). Start the backend first.

### Production build

```bash
REACT_APP_API_URL=https://your-api.onrender.com npm run build
```

Windows (PowerShell):

```powershell
$env:REACT_APP_API_URL="https://your-api.onrender.com"
npm run build
```

---

## Checklist

- [ ] Backend deployed and `/api/health` works
- [ ] `REACT_APP_API_URL` set **before** build
- [ ] Backend `CLIENT_URL` updated to this site’s URL
- [ ] Backend redeployed after `CLIENT_URL` change

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error | Fix `CLIENT_URL` on backend (see backend DEPLOYMENT) |
| API calls wrong host | Rebuild after setting `REACT_APP_API_URL` |
| `Network Error` on login | Backend cold start — wait and retry |
