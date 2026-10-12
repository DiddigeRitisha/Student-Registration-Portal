# Student Registration Portal

A complete full-stack **Student Registration Portal** built according to the provided TechN Global Full Stack Development minor-project brief.

## Project requirements covered

- Functional requirements: registration, login, profile management
- Student database schema
- Backend server and REST API endpoints
- JWT authentication
- Input validation and error handling
- React frontend forms and dashboard
- Frontend/backend API integration
- Student CRUD operations
- Automated backend API tests
- MongoDB database
- Cloud deployment documentation
- System architecture and API documentation
- Synthetic sample student dataset

## Technology stack

### Frontend
- React
- Vite
- React Router
- Plain CSS
- Fetch API

### Backend
- Node.js
- Express
- Mongoose
- JWT
- bcryptjs
- express-validator
- Helmet
- CORS
- Morgan

### Database
- MongoDB / MongoDB Atlas

### Authentication
- JSON Web Token (JWT)
- Password hashing with bcrypt

## Folder structure

```text
student-registration-portal/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── data/
│   └── students.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Prerequisites

Install:

1. Node.js 20 LTS or newer
2. npm
3. MongoDB locally OR a MongoDB Atlas database

## 1. Start MongoDB

### Option A: MongoDB locally

Make sure MongoDB is running on:

```text
mongodb://127.0.0.1:27017
```

### Option B: MongoDB Atlas

Create a database and copy its connection string.

## 2. Configure backend

Open a terminal:

```bash
cd server
npm install
```

Copy:

```text
.env.example
```

to:

```text
.env
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_registration_portal
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

## 3. Start frontend

Open another terminal:

```bash
cd client
npm install
```

Copy:

```text
.env.example
```

to:

```text
.env
```

Use:

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## 4. Use the application

1. Create an account using Register.
2. Login.
3. Open Dashboard.
4. Add student records.
5. Search/filter student records.
6. Edit or delete records.
7. Open Profile and update account details.
8. Logout.

## API overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
```

### Students

```text
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

All student routes require:

```text
Authorization: Bearer <JWT>
```

Full API documentation is available in `docs/API.md`.

## Testing

Backend tests use Node's built-in test runner and Supertest.

```bash
cd server
npm test
```

The tests verify:

- Health endpoint
- Registration validation
- Successful registration
- Duplicate email rejection
- Login validation
- Protected route access
- Student CRUD flow when a MongoDB test database is available

See `docs/TESTING.md`.

## Dataset

The provided dataset is synthetic educational data and is stored at:

```text
data/students.json
```

It is included for demonstration and testing only.

## Security practices

- Passwords are never stored as plain text.
- bcrypt is used for password hashing.
- JWT protects authenticated API routes.
- Helmet adds common HTTP security headers.
- CORS is configured through an environment variable.
- Request validation is implemented with express-validator.
- Sensitive `.env` files are excluded from Git.

## Deployment

See `docs/DEPLOYMENT.md` for:

- MongoDB Atlas setup
- Backend deployment
- Frontend deployment
- Environment variables
- Production checklist

## Architecture

See `docs/ARCHITECTURE.md`.

## Academic submission note

This implementation uses MongoDB from the brief's allowed database options (`MongoDB / MySQL`). The application is intentionally structured into frontend, backend, models, controllers, routes, validation, authentication, tests, dataset, and documentation so each requested guideline can be demonstrated clearly during a viva or project review.

## Authentication pages

The client includes working routes for:
- `/login` — login with email and password
- `/register` — create a new account with name, email, password and confirmation
- `/forgot-password` — request a password reset link
- `/reset-password?token=...` — set a new password
- `/dashboard` — protected student dashboard
- `/profile` — protected profile management

For local development, the forgot-password endpoint returns a reset link in the response instead of sending email. In production, connect that link to an email provider.

## Cloud deployment

The project includes `render.yaml` for Render deployment and `client/vercel.json` for Vercel SPA routing. See `docs/CLOUD_DEPLOYMENT.md` for the complete deployment procedure.
