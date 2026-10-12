# Testing Guide

## Automated tests

The backend uses:

- Node.js built-in test runner
- Supertest

Run:

```bash
cd server
npm install
npm test
```

The current test suite checks:

1. API health endpoint
2. Registration validation
3. Login validation
4. JWT-protected student endpoint

## Manual test checklist

### Registration

- Submit an empty form.
- Enter an invalid email.
- Enter a password shorter than 8 characters.
- Register with valid data.
- Try registering the same email twice.

### Login

- Test wrong email/password.
- Test valid credentials.
- Confirm dashboard opens after login.
- Confirm logout removes access.

### Student CRUD

- Add a valid student.
- Try invalid Student ID.
- Try invalid email.
- Try invalid phone.
- Edit an existing student.
- Search by name, ID, email or course.
- Filter by department.
- Delete a student.
- Confirm deleted student disappears.

### Profile

- Change name.
- Change email.
- Try an invalid email.
- Try an email already used by another account.

## Expected result

Invalid data should produce a clear validation message instead of silently being accepted. Protected API routes should reject requests without a valid JWT.
