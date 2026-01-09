# User Management API Reference

Base URL (local): `http://localhost:3000/api/users`

All endpoints return JSON and may respond with `message` fields describing errors. Authenticated routes expect a `Bearer <token>` header containing a JWT issued by the login endpoint.

## Authentication
- Algorithm: HMAC SHA-256 (`jsonwebtoken` default)
- Secret: `JWT_SECRET` from your environment
- Expiration: `JWT_EXPIRATION` (default `1h`)

## Endpoints

### POST `/register`
Create a new user.

Request body:
```json
{
  "username": "hannah.nguyen",
  "email": "hannah@example.com",
  "password": "Passw0rd!"
}
```

Responses:
- `201 Created`: `{ "message": "User registered successfully" }`
- `400 Bad Request`: Validation or duplicate errors.

### POST `/login`
Authenticate an existing user and retrieve a JWT.

Request body:
```json
{
  "email": "hannah@example.com",
  "password": "Passw0rd!"
}
```

Responses:
- `200 OK`: `{ "token": "<jwt>" }`
- `401 Unauthorized`: Invalid credentials.

### GET `/profile`
Return the authenticated user profile (password omitted).

Headers: `Authorization: Bearer <jwt>`

Responses:
- `200 OK`: Full user document, e.g.
```json
{
  "_id": "5f8c2d6f2d8a2b1a1c1a1a1a",
  "username": "hannah.nguyen",
  "email": "hannah@example.com",
  "createdAt": "2024-02-01T10:00:00.000Z",
  "updatedAt": "2024-02-01T10:00:00.000Z"
}
```
- `401 Unauthorized`: Missing/invalid token.
- `404 Not Found`: Authenticated user no longer exists.

## Error Handling
Errors are normalized by `errorMiddleware` and generally follow:
```json
{
  "message": "Descriptive text"
}
```
HTTP status codes reflect the error category (4xx for client issues, 5xx for server issues).
