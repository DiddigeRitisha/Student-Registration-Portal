# ☁️ Deployment Guide

This guide explains how to deploy the **Student Registration Portal** using MongoDB Atlas for the database, a Node.js-compatible hosting service for the backend, and a static hosting service for the React frontend.

## 📋 Prerequisites

Before deployment, ensure you have:

- ✅ A GitHub repository containing the project
- ✅ A MongoDB Atlas account
- ✅ A backend hosting account
- ✅ A frontend hosting account
- ✅ Access to configure environment variables

## 🗄️ 1. Configure MongoDB Atlas

1. Create a project in [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database cluster.
3. Create a database user with the required permissions.
4. Configure network access to allow connections from your backend hosting service.
5. Copy the MongoDB connection string.

Example connection string:

```text
mongodb+srv://USERNAME:PASSWORD@cluster.example.mongodb.net/student_registration_portal
```

Replace the example values with your actual database credentials and cluster details.

⚠️ **Security:** Never publish your database password or connection string containing credentials in your GitHub repository.

## ⚙️ 2. Deploy the Backend

Deploy the `server` directory to a Node.js-compatible hosting service, such as Render.

### Build and installation command

```bash
npm install
```

### Start command

```bash
npm start
```

Make sure the `server/package.json` file defines a suitable `start` script before deploying.

### 🔐 Backend Environment Variables

Configure the following variables in your hosting provider's dashboard:

```env
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your long random secret>
CLIENT_URL=<your deployed frontend URL>
NODE_ENV=production
```

**Important:**

- Use a strong, randomly generated JWT secret.
- Set `MONGODB_URI` to your actual Atlas connection string.
- Set `CLIENT_URL` to the deployed frontend's origin, without an unnecessary trailing path.
- Keep production secrets in the hosting provider's environment settings.
- Do not commit `.env` files to GitHub.

### 🩺 Verify the Backend

After deployment, open the health endpoint:

```text
https://YOUR-BACKEND-DOMAIN/api/health
```

Replace `YOUR-BACKEND-DOMAIN` with your actual backend hostname.

Confirm that the endpoint responds successfully before connecting the frontend.

## 🎨 3. Deploy the Frontend

Deploy the `client` directory to a static frontend hosting service, such as Vercel.

### Build command

```bash
npm install
npm run build
```

### Output directory

```text
dist/
```

### 🌐 Frontend Environment Variable

Configure the following variable in the frontend hosting dashboard:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

Replace the placeholder with the actual deployed backend URL.

The frontend must use the deployed backend URL instead of `http://localhost:5000/api`.

### 🔄 Single-Page Application Routing

Configure the frontend hosting service to serve `index.html` for supported client-side routes if required by the hosting platform. This ensures that routes such as `/login` and `/dashboard` work when opened directly.

## 🔗 4. Configure Frontend and Backend Communication

Ensure that:

- The backend CORS configuration allows the deployed frontend origin.
- The frontend API URL points to the deployed backend.
- The backend can connect to MongoDB Atlas.
- All environment variables are configured correctly.
- HTTPS is enabled for production endpoints.

If the frontend cannot communicate with the backend, inspect the browser console and backend logs for CORS, network, or configuration errors.

## ✅ 5. Production Checklist

Before publishing the application, verify each item.

- [ ] MongoDB Atlas is configured and accessible.
- [ ] Backend environment variables are configured.
- [ ] Frontend environment variables are configured.
- [ ] Production CORS settings allow the correct frontend origin.
- [ ] HTTPS is enabled.
- [ ] JWT secret is strong and private.
- [ ] MongoDB network access is restricted appropriately.
- [ ] No secrets are committed to GitHub.
- [ ] Backend health endpoint responds successfully.
- [ ] User registration and login work.
- [ ] Student CRUD operations work.
- [ ] Protected routes reject unauthenticated requests.
- [ ] Frontend builds successfully.
- [ ] Backend tests pass.

## 🛠️ 6. Troubleshooting

| Problem | What to check |
|---|---|
| Backend fails to start | Start script, environment variables, and hosting logs |
| MongoDB connection fails | Atlas connection string, database user, and network access |
| Frontend cannot reach backend | `VITE_API_URL`, backend availability, and CORS settings |
| Login fails after deployment | API URL, JWT configuration, and backend logs |
| Refreshing a page returns 404 | Static hosting rewrite configuration |
| API works locally but not in production | Production environment variables and database access |

## 🎉 Deployment Complete

Once all checks pass, the Student Registration Portal should be accessible through its deployed frontend URL and connected to its deployed backend and database.

**Keep all credentials private and verify the deployed application before sharing it for academic evaluation.**
