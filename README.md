## User Management Service

Lightweight Express + MongoDB API that handles user registration, login, and profile retrieval with JWT authentication.

### Features
- REST endpoints for register/login/profile
- Password hashing with bcrypt and JWT-based auth
- Centralized error handling and validation hooks
- Ready-to-run Docker + MongoDB Compose stack

---

## Prerequisites
- Node.js 18+ (Node 20 LTS recommended)
- npm 9+
- MongoDB instance (local, Docker, or Atlas)
- `mongosh` CLI for manual inspections (optional)

---

## Local Development

1. **Install dependencies**
   ```bash
   cd user-management-service
   npm install
   ```
2. **Configure environment**
   ```bash
   cp .env.example .env
   # update MONGODB_URI, JWT_SECRET, etc.
   ```
3. **Run the server**
   ```bash
   npm run dev   # nodemon reloads on save
   # or
   npm start     # plain node src/app.js
   ```
4. **Ping the API**
   ```bash
   curl -X POST http://localhost:3000/api/users/register \
        -H "Content-Type: application/json" \
        -d '{"username":"hannah.nguyen","email":"hannah@example.com","password":"Passw0rd!"}'
   ```

---

## Environment Variables

| Name | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port exposed by Express | `3000` |
| `MONGODB_URI` | Mongo connection string | `mongodb://root:example@localhost:27017/user_management` |
| `JWT_SECRET` | Secret used to sign tokens | *(none, required)* |
| `JWT_EXPIRATION` | Lifetime for generated JWTs | `1h` |

Copy `.env.example` to `.env` for local runs. Docker Compose overrides `MONGODB_URI` automatically, but still requires the JWT fields.

---

## Docker Setup

The repo ships with a production-ready `Dockerfile` and a `docker-compose.yml` that wires the API to a MongoDB 7 container.

```bash
docker compose up --build
```

This command:
- Builds the API image from `Dockerfile`
- Starts MongoDB with credentials `root/example`
- Injects your `.env` file for JWT/PORT configuration
- Exposes the API at `http://localhost:3000`

Helpful commands:
- `docker compose logs -f api` — follow API logs
- `docker compose exec mongo mongosh -u root -p example` — open the Mongo shell inside the DB container
- `docker compose down -v` — stop and remove containers plus the Mongo volume

---

## Verifying Data

1. Register a user via the `/register` endpoint.
2. Check MongoDB:
   ```bash
   mongosh "mongodb://root:example@127.0.0.1:27017/user_management?authSource=admin" \
     --eval 'db.users.find({}, { username: 1, email: 1, createdAt: 1, _id: 0 }).pretty()'
   ```
   (Or run the command inside the Mongo container using `docker compose exec mongo mongosh ...`.)
3. Authenticate:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"hannah@example.com","password":"Passw0rd!"}' | jq -r .token)
   curl http://localhost:3000/api/users/profile -H "Authorization: Bearer $TOKEN"
   ```

---

## Documentation
- API reference with payloads and sample responses: [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md)

---

## Project Scripts
| Command | Description |
| --- | --- |
| `npm start` | Launch the API using Node |
| `npm run dev` | Start the API with Nodemon for hot reload |

Tests are not defined yet. Add Jest/Supertest suites under `tests/` and update the `test` script when ready.
