# Deployment Guide

The application can be deployed with a hosted MongoDB database, a Node/Express backend host and a static React frontend host.

## 1. MongoDB Atlas

1. Create a MongoDB Atlas project.
2. Create a database cluster.
3. Create a database user.
4. Allow the deployment server's IP/network according to your security policy.
5. Copy the MongoDB connection string.

Example:

```text
mongodb+srv://USERNAME:PASSWORD@cluster.example.mongodb.net/student_registration_portal
```

## 2. Backend deployment

Deploy the `server` directory to a Node-compatible host.

Build/install command:

```bash
npm install
```

Start command:

```bash
npm start
```

Set these environment variables:

```env
PORT=5000
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=<your deployed frontend URL>
NODE_ENV=production
```

Do not commit `.env`.

## 3. Frontend deployment

Deploy the `client` directory to a static hosting service.

Build:

```bash
npm install
npm run build
```

Set:

```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

The generated `dist/` folder is the production frontend.

## 4. Production checklist

- Use HTTPS.
- Use a strong random JWT secret.
- Restrict MongoDB network access.
- Set `CLIENT_URL` to the real frontend origin.
- Do not commit secrets.
- Use production environment variables.
- Test the health endpoint after deployment.
- Test login and CRUD operations after deployment.
