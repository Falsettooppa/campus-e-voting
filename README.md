# campus-e-voting

This is an app built for digital voting in campuses.

## Local development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`
- Auth endpoints are served from `http://localhost:5000/api/auth/*`

The frontend is configured with a CRA dev proxy (`frontend/package.json`) so calls to `/api/*` are forwarded to `http://localhost:5000` in local development.

If needed, you can override API base URL with:

- `REACT_APP_API_URL` (example: `http://localhost:5000/api`)
