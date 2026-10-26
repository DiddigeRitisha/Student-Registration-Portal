# Project Guidelines Checklist — Student Registration Portal

| # | Required guideline | Status and evidence |
|---|---|---|
| 1 | Define registration, login, and profile requirements | Implemented: registration, login, password reset, dashboard and profile screens. |
| 2 | Design a student database schema | Implemented with Mongoose User/Student models. |
| 3 | Set up backend and API endpoints | Implemented with Node.js and Express; see `docs/API.md`. |
| 4 | Authentication and validation | JWT-protected routes, password hashing and request validators are present. |
| 5 | Frontend forms and dashboards | React forms and dashboard pages are present. |
| 6 | Frontend/backend integration | Client API service calls the server endpoints; verify using the local run steps in README. |
| 7 | Student CRUD | Student create/read/update/delete routes and UI are implemented. |
| 8 | Test validation and errors | Automated tests currently cover health status, invalid registration/login input and rejection of unauthenticated student access. Successful auth, duplicate-email, and full CRUD flows still need integration tests before claiming full automated coverage. |
| 9 | Cloud deployment | Render and Vercel configuration files are included. This is deployment configuration, not proof of a live public deployment; add deployed URLs after deploying. |
| 10 | Document architecture and API | See `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/TESTING.md`, and deployment guides. |

## Responsive UI verification

CSS includes responsive media queries. Before submission, manually check login, registration, dashboard, student table, profile and settings at 360px, 768px and desktop widths. Confirm no page-level horizontal overflow, readable labels, usable buttons, and tables that scroll within their own container when needed. Record screenshots/results in `docs/TESTING.md`.

## Data and reference note

The portal uses synthetic educational records. `https://github.com/typicode/json-server` is a tool/reference link, not the source of the synthetic dataset. Do not describe it as the dataset source.

## Stack

- Frontend: React, HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt-compatible password hashing

## Submission hygiene

Do not submit `node_modules`, `.git`, local `.env` files or credentials. Keep `.env.example` with placeholder values. Keep one canonical project tree.
