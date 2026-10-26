# 🎓 Student Registration Portal

A complete full-stack **Student Registration Portal** developed according to the TechN Global Full Stack Development minor-project brief.

The application provides user authentication, profile management, and student record management using React, Node.js, Express, and MongoDB.

## 📌 Project Requirements

- ✅ User registration and login
- ✅ Profile management
- ✅ Student database schema
- ✅ REST API endpoints
- ✅ JWT-based authentication
- ✅ Input validation and error handling
- ✅ React frontend forms and dashboard
- ✅ Frontend and backend API integration
- ✅ Student CRUD operations
- ✅ Automated backend API tests
- ✅ MongoDB database integration
- ✅ System architecture and API documentation
- ✅ Synthetic sample student dataset
- ✅ Cloud deployment documentation
- ✅ Responsive user interface

## 🛠️ Technology Stack

### 🎨 Frontend
- ⚛️ React
- ⚡ Vite
- 🧭 React Router
- 🎨 CSS
- 🌐 Fetch API

### ⚙️ Backend
- 🟢 Node.js
- 🚀 Express.js
- 🗂️ Mongoose
- 🔐 JSON Web Token (JWT)
- 🔒 bcryptjs
- ✅ express-validator
- 🛡️ Helmet
- 🌐 CORS
- 📝 Morgan

### 🗄️ Database
- 🍃 MongoDB
- ☁️ MongoDB Atlas

### 🧪 Testing
- 🧪 Node.js built-in test runner
- 🔍 Supertest

## 📂 Project Structure

```text
Student Registration Portal/
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
├── render.yaml
└── README.md
```

*Note: The structure above is illustrative. Ensure the filenames match your actual repository.*

## 📋 Prerequisites

Install the following before running the application:

- 📦 Node.js 20 LTS or newer
- 📦 npm
- 🗄️ MongoDB locally or a MongoDB Atlas database

Check your installed versions:

```bash
node --version
npm --version
```

## 🚀 Installation and Setup

### 1️⃣ Configure MongoDB

**Option A — Local MongoDB**

Ensure your MongoDB server is running at:

```text
mongodb://127.0.0.1:27017
```

**Option B — MongoDB Atlas**

Create an Atlas database and obtain its connection string. Configure database access and network permissions before connecting.

### 2️⃣ Configure the Backend

From the project root, run:

```bash
cd server
npm install
```

Create a `.env` file by copying `server/.env.example`.

Example configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_registration_portal
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

⚠️ Replace placeholder values with appropriate settings. Never commit real secrets to GitHub.

Start the backend:

```bash
npm run dev
```

**🔎 Health check:**

`http://localhost:5000/api/health`

### 3️⃣ Configure the Frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Create `client/.env` using `client/.env.example`.

Example configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

**🌐 Open the application:**

`http://localhost:5173`

Keep both terminals running while using the application.

## 👩‍🎓 Using the Application

1. 📝 Register a new account.
2. 🔑 Log in with your credentials.
3. 📊 Open the dashboard.
4. ➕ Add student records.
5. 🔍 Search and view student records.
6. ✏️ Edit existing records.
7. 🗑️ Delete records when required.
8. 👤 Open the profile page to manage account details.
9. 🚪 Log out securely.

*The available functionality depends on the implementation in the repository.*

## 🔗 Application Routes

| Route | Description |
|---|---|
| `/login` | 🔑 User login |
| `/register` | 📝 Account registration |
| `/forgot-password` | 📩 Request a password-reset link |
| `/reset-password?token=...` | 🔒 Reset password using a token |
| `/dashboard` | 📊 Protected student dashboard |
| `/profile` | 👤 Profile management |

Verify that these routes match the current frontend implementation.

## 🌐 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/auth/me` | Retrieve the authenticated user's information |
| `PUT` | `/api/auth/me` | Update the authenticated user's information |

### 🎓 Student Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Retrieve student records |
| `GET` | `/api/students/:id` | Retrieve a specific student |
| `POST` | `/api/students` | Create a student record |
| `PUT` | `/api/students/:id` | Update a student record |
| `DELETE` | `/api/students/:id` | Delete a student record |

🔒 **Authentication:** Student routes that require authentication must receive a valid JWT in the request header:

```http
Authorization: Bearer <JWT>
```

📖 Full API documentation: `docs/API.md`

## 🧪 Testing

Run the backend tests:

```bash
cd server
npm install
npm test
```

The test suite may cover:

- ✅ Health endpoint responses
- ✅ Registration validation
- ✅ Successful registration
- ✅ Duplicate email rejection
- ✅ Login validation
- ✅ Protected route access
- ✅ Student CRUD operations when a test database is available

📖 Refer to `docs/TESTING.md` for test setup and details.

*Actual test coverage depends on the tests implemented in the repository.*

## 📊 Sample Dataset

The project includes a synthetic student dataset:

`data/students.json`

📌 The dataset is intended for demonstration and testing, not as real student information.

## 🛡️ Security Practices

- 🔒 Password hashing with bcrypt
- 🔑 JWT-based authentication
- 🛡️ HTTP security headers through Helmet
- 🌐 Configurable CORS
- ✅ Request validation with express-validator
- 🔐 Environment variables for sensitive configuration
- 🚫 Git exclusions for local `.env` files

Never publish real passwords, database credentials, JWT secrets, or other sensitive information.

## 📱 Responsive Design

The frontend uses CSS to support different screen sizes.

Recommended checks before submission:

- 📱 Mobile: approximately 360px wide
- 📲 Tablet: approximately 768px wide
- 🖥️ Desktop: normal laptop or monitor width

Verify forms, navigation, dashboard tables, buttons, and page layouts on each screen size.

## 🏗️ Architecture

The application separates frontend components, backend routes, controllers, models, middleware, and validation logic.
📖 See `docs/ARCHITECTURE.md` for system architecture and component responsibilities.

## ☁️ Deployment
The repository includes deployment configuration intended to support cloud hosting.

📖 See `docs/DEPLOYMENT.md` for the deployment instructions included in the project.

### 🚀 Production Checklist

- [ ] Configure a production MongoDB database.
- [ ] Set backend environment variables.
- [ ] Configure the frontend API URL for the deployed backend.
- [ ] Configure production CORS origins.
- [ ] Keep credentials and secrets out of source control.
- [ ] Run backend tests.
- [ ] Build the frontend.
- [ ] Verify the deployed frontend and API.

If your repository uses `docs/CLOUD_DEPLOYMENT.md` instead, update the documentation links to match the actual filename.

## 📚 Project Documentation

| File | Purpose |
|---|---|
| `docs/API.md` | 🌐 API endpoints and usage |
| `docs/ARCHITECTURE.md` | 🏗️ System architecture |
| `docs/TESTING.md` | 🧪 Testing instructions |
| `docs/DEPLOYMENT.md` | ☁️ Deployment instructions |

## 🎓 Academic Submission Note

This project uses MongoDB, one of the database options identified in the project brief. Its frontend, backend, database models, controllers, routes, validation, authentication, tests, dataset, and documentation are organized to make the implementation easier to understand and demonstrate during an academic review or viva.

## 📩 Password Reset Note

In local development, the password-reset endpoint may return a reset link in its response instead of sending an email.

Verify the backend implementation before presenting email delivery as a completed feature. For production email delivery, configure an email provider and appropriate token expiration and security controls.

---

⭐ **Student Registration Portal — Full Stack Development Minor Project**

💻 Built with React, Node.js, Express, and MongoDB.
