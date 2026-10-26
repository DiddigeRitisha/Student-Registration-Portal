# Cloud Deployment — Student Registration Portal

This project is prepared for cloud deployment. The repository includes `render.yaml` for a two-service Render deployment and `client/vercel.json` for SPA routing if the React frontend is deployed to Vercel.

## Option A — Render (backend + frontend)

1. Push the complete project to GitHub.
2. Open Render and create a new Blueprint from the repository.
3. Render will read `render.yaml` and create:
   - `student-registration-portal-api` — Node/Express backend
   - `student-registration-portal-client` — React static frontend
4. In the backend service, set `MONGODB_URI` to your hosted MongoDB connection string.
5. Keep the generated `JWT_SECRET` private.
6. After the first deployment, confirm the frontend and backend URLs. If Render assigns different URLs, update:
   - backend `CLIENT_URL` = the exact frontend URL
   - frontend `VITE_API_URL` = the backend URL ending in `/api`
7. Redeploy after changing environment variables.
8. Verify:
   - `https://YOUR-BACKEND.onrender.com/api/health`
   - registration
   - login
   - dashboard
   - profile
   - forgot/reset password
   - student CRUD

## MongoDB

Use MongoDB Atlas or another hosted MongoDB provider for production. Do not put database credentials in GitHub or source files.

Required backend variables:

```env
NODE_ENV=production
MONGODB_URI=<hosted MongoDB connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=https://<your-frontend-domain>
```

Required frontend variable:

```env
VITE_API_URL=https://<your-backend-domain>/api
```

## Option B — Vercel frontend

The `client/vercel.json` file enables SPA fallback routing. Deploy the `client` folder with:

```bash
npm install
npm run build
```

Set:

```env
VITE_API_URL=https://<your-backend-domain>/api
```

Then set the backend `CLIENT_URL` to the deployed Vercel URL.

## Important

The files in this ZIP make the project deployment-ready, but an actual public deployment requires the owner's GitHub/cloud accounts and hosted MongoDB credentials. Those credentials must not be placed in this ZIP.
