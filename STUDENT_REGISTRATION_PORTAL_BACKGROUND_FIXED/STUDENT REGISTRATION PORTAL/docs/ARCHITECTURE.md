# System Architecture

## High-level architecture

```text
                    ┌──────────────────────────┐
                    │       React Client       │
                    │ Login / Register         │
                    │ Dashboard / Profile      │
                    └────────────┬─────────────┘
                                 │ HTTPS / JSON
                                 ▼
                    ┌──────────────────────────┐
                    │    Express REST API      │
                    │ Routes + Controllers     │
                    │ Validation + Middleware  │
                    └────────────┬─────────────┘
                                 │ Mongoose
                                 ▼
                    ┌──────────────────────────┐
                    │         MongoDB           │
                    │ Users + Students          │
                    └──────────────────────────┘
```

## Frontend layers

- `pages/` contains application screens.
- `components/` contains reusable UI components.
- `context/` contains authentication state.
- `services/` contains API communication.
- `styles.css` contains responsive UI styling.

## Backend layers

- `routes/` maps HTTP methods and URLs.
- `controllers/` contains business logic.
- `models/` defines MongoDB schemas.
- `validators/` defines input rules.
- `middleware/` handles JWT authentication, validation, and errors.
- `config/` contains database connection logic.

## Authentication flow

```text
Register/Login
     ↓
Express validates input
     ↓
Password checked/hashed with bcrypt
     ↓
JWT issued
     ↓
Browser stores JWT
     ↓
JWT sent as Bearer token
     ↓
Auth middleware verifies token
     ↓
Protected controller executes
```

## Data model

### User

- name
- email
- password hash
- timestamps

### Student

- studentId
- fullName
- email
- phone
- course
- year
- department
- dateOfBirth
- gender
- address
- createdBy
- timestamps

The `createdBy` field links each student record to the authenticated account that created it.
