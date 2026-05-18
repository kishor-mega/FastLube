import axios from 'axios';

/**
 * API client for FastLube backend.
 * - Local dev: leave REACT_APP_API_URL unset — CRA proxy (frontend/package.json) forwards /api to backend.
 * - Production: set REACT_APP_API_URL to your deployed backend (e.g. https://fastlube-api.onrender.com)
 *
 * Never put JWT_SECRET or MONGODB_URI here — those belong only in backend/.env
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
