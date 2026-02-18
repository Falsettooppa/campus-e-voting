# campus-e-voting

This is an app built for digital voting in campuses.

## Local development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`
- Auth endpoints are served from `http://localhost:5000/api/auth/*`

The frontend is configured with a CRA dev proxy (`frontend/package.json`) so calls to `/api/*` are forwarded to `http://localhost:5000` in local development.

If needed, you can override API base URL with:

- `REACT_APP_API_URL` (example: `http://localhost:5000/api`)

## Backend setup (required for auth APIs)

From `backend/`:

1. Create env file:
   - copy `backend/.env.example` to `backend/.env`
2. Ensure MongoDB is running locally on `127.0.0.1:27017` **or** set `MONGODB_URI` to your MongoDB instance.
3. Start backend server:
   - `node index.js`

If MongoDB is not running, backend startup will fail with `ECONNREFUSED` and auth endpoints will not be available.
