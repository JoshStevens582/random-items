# Random Items

Full-stack demo for managing a collection of short strings with CRUD and a shuffle endpoint. Built as a portfolio piece: FastAPI + SQLite on the backend, React + Vite on the frontend.

**Stack:** Python 3.12 · FastAPI · SQLAlchemy · SQLite · React · TypeScript · Vite

![App screenshot](docs/screenshot.png)

> After you run the app locally, capture a screenshot of the UI and save it as `docs/screenshot.png` so this image appears on GitHub.

## Features

- Create, list, update, and delete string items
- Shuffle the collection into a randomized order
- Portfolio-oriented UI with a shuffle-first hero and manage section below

## Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/)
- Node.js 20+ (for the frontend)

## Setup

```bash
# API
uv sync

# Frontend
cd frontend
npm install
cd ..
```

Copy `frontend/.env.example` to `frontend/.env` if you need to override the API base URL (defaults to `http://127.0.0.1:8000`).

## Run

Start the API and UI in two terminals:

```bash
# Terminal 1 — API (http://127.0.0.1:8000)
uv run random-items
```

```bash
# Terminal 2 — UI (http://127.0.0.1:5173)
cd frontend
npm run dev
```

Interactive API docs: `http://127.0.0.1:8000/docs`

## API endpoints

| Method | Path            | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/items`        | Create a new string item             |
| GET    | `/items`        | List all items                       |
| GET    | `/items/random` | All item strings in randomized order |
| GET    | `/items/{id}`   | Get a single item by ID              |
| PUT    | `/items/{id}`   | Update an item                       |
| DELETE | `/items/{id}`   | Delete an item                       |
| GET    | `/health`       | Health check                         |

## Project layout

```
src/random_items/   # FastAPI app, models, services
frontend/           # React + Vite SPA
docs/               # Screenshot for README
```

## Example (API only)

```bash
curl -X POST http://127.0.0.1:8000/items -H "Content-Type: application/json" -d "{\"content\": \"apple\"}"
curl http://127.0.0.1:8000/items/random
```
