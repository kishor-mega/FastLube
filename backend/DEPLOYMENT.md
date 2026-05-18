# Backend deployment

Deploy **only this `backend/` folder** to Render, Railway, or similar.

## Prerequisites

Create a free **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** cluster first.

### MongoDB Atlas setup

1. Create account → **Build a Database** → **M0 FREE**.
2. Create a database user (username + password).
3. **Network Access** → **Add IP** → `0.0.0.0/0` (required for cloud hosts like Render).
4. **Connect** → **Drivers** → copy connection string.
5. Replace `<password>` and set database name, e.g.  
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/fastlube?retryWrites=true&w=majority`

---

## Deploy on Render (free tier)

1. Push project to **GitHub**.
2. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
3. Connect your repo.
4. Settings:
   - **Name:** `fastlube-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment** (required):

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string |
   | `CLIENT_URL` | Your frontend URL (e.g. `https://fastlube.netlify.app`) |

6. Deploy → copy URL, e.g. `https://fastlube-api.onrender.com`
7. Test: open `https://fastlube-api.onrender.com/api/health`

> **Note:** Free Render services sleep after inactivity; first request may be slow.

### Optional: Render Blueprint

Use `render.yaml` in this folder when connecting via **New → Blueprint** (set repo root, Render uses `rootDir: backend`).

---

## After frontend is deployed

Set `CLIENT_URL` on this service to your **exact** frontend origin (including `https://`), then **redeploy**.

---

## Checklist

- [ ] MongoDB Atlas cluster + `MONGODB_URI`
- [ ] `JWT_SECRET` set
- [ ] `/api/health` returns OK
- [ ] `CLIENT_URL` matches frontend URL exactly
- [ ] Redeployed after changing `CLIENT_URL`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error in browser | Set `CLIENT_URL` to exact frontend origin |
| MongoDB connection failed | Check Atlas IP allowlist and password in URI |
| API slow on first request | Render free tier cold start — wait ~30s |

**Never** put `JWT_SECRET` or `MONGODB_URI` in the frontend — only the backend needs them.
