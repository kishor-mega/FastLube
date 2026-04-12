import axios from 'axios';

/**
 * Base URL for the FastLube API.
 * - Development with CRA proxy: leave unset (empty) — requests use /api/... and proxy to server/package.json "proxy"
 * - Production or direct calls: set REACT_APP_API_URL in .env (e.g. http://localhost:5000 or your deployed API)
 *
 * Never put JWT_SECRET, MongoDB URI, or other secrets here — those stay in server/.env only.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
