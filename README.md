# Sales Management

Sales Management is a full-stack sales management project with a Node.js/Express backend and a Next.js frontend.

The application includes authentication, password reset flow, product management, customer management, orders, profile handling, PostgreSQL persistence, API documentation, unit tests, integration tests, and Cypress end-to-end tests.

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Docker Compose
- JWT authentication
- Swagger UI
- Jest

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- Jest and Testing Library
- Cypress

## Project Structure

```text
.
├── backend
│   ├── src
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env.example
└── frontend
    ├── app
    ├── components
    ├── cypress
    ├── lib
    └── package.json
```

## Requirements

Install these tools before running the project:

- Node.js
- npm
- Docker
- Docker Compose

The backend and frontend are separate Node.js projects, so dependencies must be installed in both folders.

## Quick Start

From the repository root, install backend dependencies:

```bash
cd backend
npm install
```

Create the backend environment file:

```bash
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d
```

Run database migrations:

```bash
npm run typeorm -- migration:run -d src/common/infrastructure/typeorm/index.ts
```

Seed the database:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

In another terminal, install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:3000
```

The API runs at:

```text
http://localhost:3333
```

The Swagger documentation is available at:

```text
http://localhost:3333/docs
```

## Default Seed User

After running `npm run seed`, you can sign in with:

```text
Email: admin@apivendas.com
Password: 123456
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env
```

The default `.env.example` is already configured for the local Docker database:

```env
PORT=3333
NODE_ENV=development
API_URL=http://localhost:3333

DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_SCHEMA=public
DB_NAME=postgres
DB_USER=postgres
DB_PASS=postgres

JWT_SECRET=my_secret
JWT_EXPIRES_IN=86400
```

The project also defines Cloudflare R2/S3-related variables. Keep them empty for local development unless you are testing file upload features that require object storage.

### Start PostgreSQL

The backend includes a Docker Compose file with PostgreSQL:

```bash
docker compose up -d
```

This starts a PostgreSQL container using:

```text
Host: localhost
Port: 5432
Database: postgres
User: postgres
Password: postgres
```

To stop the database:

```bash
docker compose down
```

To stop the database and remove the persisted volume:

```bash
docker compose down -v
```

### Run Migrations

Run migrations after starting PostgreSQL:

```bash
npm run typeorm -- migration:run -d src/common/infrastructure/typeorm/index.ts
```

To revert the latest migration:

```bash
npm run typeorm -- migration:revert -d src/common/infrastructure/typeorm/index.ts
```

### Seed the Database

Create demo data:

```bash
npm run seed
```

Force a clean seed, clearing existing products, customers, orders, and the default admin user:

```bash
npm run seed:force
```

### Run the Backend

Start the development server:

```bash
npm run dev
```

The server listens on:

```text
http://localhost:3333
```

Basic health check:

```text
GET http://localhost:3333/
```

Expected response:

```json
{
  "message": "Olá Dev!"
}
```

API documentation:

```text
http://localhost:3333/docs
```

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

The frontend uses this API URL by default:

```text
http://localhost:3333
```

If you need a custom backend URL, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Recommended Local Development Flow

Use three terminals:

Terminal 1, database:

```bash
cd backend
docker compose up
```

Terminal 2, backend:

```bash
cd backend
npm run dev
```

Terminal 3, frontend:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Backend Scripts

Run from `backend/`.

```bash
npm run dev
```

Starts the API in development mode with `ts-node-dev`.

```bash
npm run lint
```

Runs ESLint.

```bash
npm test
```

Runs backend tests using `.env.test`.

```bash
npm run test:int
```

Runs integration tests. This script starts a temporary PostgreSQL container named `testsdb` on port `5433`, runs the integration test suite, and removes the container afterward.

```bash
npm run typeorm -- migration:run -d src/common/infrastructure/typeorm/index.ts
```

Runs TypeORM migrations.

```bash
npm run seed
```

Seeds the local database.

```bash
npm run seed:force
```

Clears and recreates demo seed data.

## Frontend Scripts

Run from `frontend/`.

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Builds the production application.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm test
```

Runs Jest tests.

```bash
npm run test:watch
```

Runs Jest in watch mode.

```bash
npm run test:coverage
```

Runs Jest with coverage reporting.

## Cypress End-to-End Tests

Cypress tests live in:

```text
frontend/cypress/e2e
```

The Cypress config uses:

```text
http://localhost:3001
```

Before running Cypress, start the backend and start the frontend on port `3001`:

```bash
cd frontend
npm run dev -- -p 3001
```

Then run Cypress from `frontend/`:

```bash
npx cypress open
```

Or run it headlessly:

```bash
npx cypress run
```

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`.

Important variables:

| Variable | Description | Default for local development |
| --- | --- | --- |
| `PORT` | API port | `3333` |
| `NODE_ENV` | Runtime environment | `development` |
| `API_URL` | Public API URL | `http://localhost:3333` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | PostgreSQL database | `postgres` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASS` | PostgreSQL password | `postgres` |
| `JWT_SECRET` | Secret used to sign JWT tokens | `my_secret` |
| `JWT_EXPIRES_IN` | Token expiration in seconds | `86400` |

### Frontend

Optional `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

If this variable is not set, the frontend falls back to `http://localhost:3333`.

## Common Issues

### The backend cannot connect to PostgreSQL

Make sure the database container is running:

```bash
cd backend
docker compose ps
```

If it is not running:

```bash
docker compose up -d
```

Also confirm that your `backend/.env` database values match `backend/docker-compose.yml`.

### Migrations fail because tables already exist

If you are working with disposable local data, reset the database volume:

```bash
cd backend
docker compose down -v
docker compose up -d
npm run typeorm -- migration:run -d src/common/infrastructure/typeorm/index.ts
npm run seed
```

### The frontend cannot reach the API

Confirm that the backend is running:

```text
http://localhost:3333
```

If your API is running on a different URL, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

### Cypress opens the wrong frontend URL

The Cypress config points to `http://localhost:3001`. Start Next.js with:

```bash
cd frontend
npm run dev -- -p 3001
```

## Useful URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Frontend for Cypress | `http://localhost:3001` |
| Backend API | `http://localhost:3333` |
| Swagger Docs | `http://localhost:3333/docs` |
| PostgreSQL | `localhost:5432` |
