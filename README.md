# Employee CRUD

One workspace for the employee CRUD API and its React UI.

## Run both with Docker (one command)

With Docker Desktop running:

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud
docker compose up
```

Open <http://127.0.0.1:5173>. See [README-Docker.md](README-Docker.md) for
prerequisites, stopping, rebuilding, and troubleshooting.

```text
employee-crud/
├── employee-api-crud/   # Python / FastAPI backend
└── employee-ui-react/   # JavaScript / React frontend
```

## Run manually without Docker

Open two terminals and keep both running.

**Terminal 1 — API:**

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-api-crud
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8080
```

If `.venv` does not exist, run `python3 -m venv .venv` before activating it.

**Terminal 2 — UI:**

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-ui-react
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. API documentation is at
<http://127.0.0.1:8080/docs>. Stop each server with `Control+C`.

Dependency installation can be skipped on later starts unless dependencies changed.
The API stores data in memory, so restarting it clears employees.

For first-time setup, explanations, and troubleshooting, see the
[API README](employee-api-crud/README.md) and
[React UI README](employee-ui-react/README.md).
