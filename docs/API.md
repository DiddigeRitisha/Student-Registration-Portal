# REST API Documentation

Base URL:

```text
http://localhost:5000/api
```

## Health

### GET `/health`

Response:

```json
{
  "status": "ok",
  "service": "Student Registration Portal API"
}
```

## Authentication

### POST `/auth/register`

Request:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password123"
}
```

Returns JWT and user details.

### POST `/auth/login`

Request:

```json
{
  "email": "demo@example.com",
  "password": "Password123"
}
```

Returns JWT and user details.

### GET `/auth/me`

Header:

```text
Authorization: Bearer <JWT>
```

Returns the logged-in user's profile.

### PUT `/auth/me`

Header:

```text
Authorization: Bearer <JWT>
```

Request:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

## Student CRUD

All student endpoints require:

```text
Authorization: Bearer <JWT>
```

### GET `/students`

Optional query parameters:

```text
?search=aarav
?department=CSE
```

### GET `/students/:id`

Returns one student belonging to the logged-in account.

### POST `/students`

Request:

```json
{
  "studentId": "STU1005",
  "fullName": "Demo Student",
  "email": "student@example.com",
  "phone": "9876543210",
  "course": "B.Tech Computer Science",
  "year": 3,
  "department": "CSE",
  "dateOfBirth": "2005-05-20",
  "gender": "Other",
  "address": "Hyderabad, Telangana"
}
```

### PUT `/students/:id`

Uses the same request body as POST and updates the record.

### DELETE `/students/:id`

Deletes the record.

## HTTP status codes

- `200` Success
- `201` Created
- `400` Validation error
- `401` Missing/invalid authentication
- `404` Resource not found
- `409` Duplicate resource
- `500` Server error
