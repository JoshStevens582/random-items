# Random Items

Save short strings, then shuffle them into a random order.

**Backend:** Python 3.12 · FastAPI · SQLAlchemy · SQLite  
**Frontend:** React · TypeScript · Vite

![App screenshot](docs/screenshot.png)

## What it does

- Add, edit, and delete items
- Shuffle the collection into a random order
- REST API with docs at `/docs`

The website (React) talks to the API (FastAPI). Locally those are two programs: the API on port 8000, the website on port 5173.

## Run locally

You do **not** need a `.env` file on your machine. Defaults already match this setup.

### Requirements

- Python 3.12+
- [uv](https://docs.astral.sh/uv/)
- Node.js 20+

### Install

```bash
uv sync

cd frontend
npm install
cd ..
```

### Start (two terminals)

**Terminal 1 — API** at http://127.0.0.1:8000

```bash
uv run random-items
```

**Terminal 2 — website** at http://127.0.0.1:5173

```bash
cd frontend
npm run dev
```

Open http://127.0.0.1:5173 in your browser.

Interactive API docs: http://127.0.0.1:8000/docs

## Configuration (optional)

The API can run on another machine without editing Python. Copy `.env.example` to `.env` and set values for **that** machine.

| Variable | Local default | What it is |
|----------|-----------------|------------|
| `DATABASE_URL` | SQLite file `items.db` in this repo | Where items are stored |
| `CORS_ORIGINS` | `http://127.0.0.1:5173`, `http://localhost:5173` | Which website may call the API |
| `HOST` / `PORT` | `127.0.0.1:8000` | Where the API listens |
| `ENV` | `development` | Use `production` to turn reload off |
| `APP_TITLE` | `Random Items API` | API title in `/docs` |

If the website should call an API that is not `http://127.0.0.1:8000`, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_BASE_URL`.

## Tests

```bash
uv sync --group dev
uv run pytest
```

GitHub Actions runs backend tests and a frontend production build on every push and pull request to `master`.

## API

| Method | Path            | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/items`        | Create a new string item             |
| GET    | `/items`        | List all items                       |
| GET    | `/items/random` | All item strings in randomized order |
| GET    | `/items/{id}`   | Get a single item by ID              |
| PUT    | `/items/{id}`   | Update an item                       |
| DELETE | `/items/{id}`   | Delete an item                       |
| GET    | `/health`       | Health check                         |

```bash
curl -X POST http://127.0.0.1:8000/items -H "Content-Type: application/json" -d "{\"content\": \"apple\"}"
curl http://127.0.0.1:8000/items/random
```

## Project layout

```
src/random_items/   FastAPI app
frontend/           React website
tests/              API tests
.env.example        API settings you can override on another machine
```
