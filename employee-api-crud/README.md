# Employee API CRUD

Simple FastAPI project for employee CRUD operations. It uses an in-memory service instead of a database, so data resets whenever the app restarts.

## Project structure

```text
employee-api-crud/
├── app/
│   ├── api/routes/employees.py       # HTTP endpoints
│   ├── schemas/employee.py           # Request/response models
│   ├── services/employee_service.py  # Business logic and in-memory storage
│   └── main.py                        # FastAPI application setup
├── postman/collections/               # API client collections
├── docs/fastapi-basics.md             # Beginner explanation
├── tests/test_employees.py
├── requirements.txt
└── README.md
```

The layers are intentionally small:

- `routes` handles HTTP requests, responses, and status codes.
- `schemas` defines the shape of employee data.
- `services` contains the application logic and storage implementation.
- `main.py` creates the app and registers versioned routes.

For a short explanation of how Python, FastAPI, Uvicorn, routes, and Swagger fit together, see [docs/fastapi-basics.md](docs/fastapi-basics.md).

## How the code works

The request flow is straightforward:

1. A request arrives at a function in `app/api/routes/employees.py`.
2. The route calls a matching function in `app/services/employee_service.py`.
3. The service reads or changes the in-memory employee dictionary.
4. FastAPI returns the result as JSON.

Some basic Python concepts used in this project:

- A variable stores a value, for example `employee_id = 1`.
- A dictionary stores multiple values using a key, such as an employee ID.
- A list stores multiple items, such as all employees returned by `GET /api/v1/employees`.
- A class groups related data and functions together.
- A Pydantic model validates the JSON sent to the API and formats the response.

There is no database. The `EmployeeService` class stores employees in memory, so the data is cleared when the application stops.

## Run locally

Follow these steps in a terminal.

Python 3.9 or newer is required. Check your installed version with `python3 --version`.

### 1. Open the project folder

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-api-crud
```

All commands in the remaining steps must be run from this folder. You can confirm your location with:

```bash
pwd
```

The output should end with:

```text
/employee-api-crud
```

### 2. Create the project environment

You only need to do this once. If the `.venv` folder already exists, skip this step:

```bash
python3 -m venv .venv
```

This creates the `.venv` folder, which contains the Python environment for this project.

### 3. Activate the environment

Run this every time you open a new terminal:

```bash
source .venv/bin/activate
```

Your terminal will usually show `(.venv)` at the beginning of the prompt. To confirm which Python is active, run `which python`; the path should end with `employee-api-crud/.venv/bin/python`.

After activation, use `python` for this project. It points to the Python executable inside `.venv`.

### 4. Install the project dependencies

Run this the first time, or whenever `requirements.txt` changes:

```bash
python -m pip install -r requirements.txt
```

If you see `Could not open requirements file`, run the `cd` command from step 1 again. That error means the terminal is in the wrong folder.

### 5. Start the application

From the same terminal, with the environment activated, run:

```bash
python -m uvicorn app.main:app --reload --port 8080
```

- `app.main:app` loads the FastAPI `app` defined in `app/main.py`.
- `--reload` restarts the server when you save code changes, which is useful while developing.
- `--port 8080` makes the API available at `http://127.0.0.1:8080`.

Wait until the terminal shows `Application startup complete` and a message like:

```text
Uvicorn running on http://127.0.0.1:8080 (Press CTRL+C to quit)
```

The command keeps running; this is expected. Leave this terminal open and continue to step 6 in your browser. Press `Control+C` in the terminal when you want to stop the API. Restarting the API clears its in-memory employees.

### 6. Open Swagger

Open this URL in your browser:

<http://127.0.0.1:8080/docs>

Swagger lets you test all employee endpoints without writing any client code. You can also use the Postman collection described below.

Other automatically generated documentation pages are available at:

- ReDoc: <http://127.0.0.1:8080/redoc>
- OpenAPI JSON: <http://127.0.0.1:8080/openapi.json>

## Returning to the project later

After the first-time setup, run these commands in a new terminal:

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-api-crud
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8080
```

Then open <http://127.0.0.1:8080/docs>. Install dependencies again only if `requirements.txt` changes or you recreate the environment.

## Performance testing with JMeter

For a local JMeter run, stop the development server with `Control+C`, then start the API without automatic reload:

```bash
python -m uvicorn app.main:app --port 8080 --workers 1
```

Run this from the API folder with the environment activated. Use one worker because this project stores employees in memory; each worker would have its own separate employee store.

Open `employee-performance.jmx` in this API folder in JMeter. See the [beginner JMeter guide](README-JMeter.md) for the steps and how to read results.

## Troubleshooting

- **`No module named uvicorn`:** activate the environment (step 3), then install dependencies (step 4).
- **`Address already in use`:** another server is using port 8080. Stop it in its terminal with `Control+C`. If you already started the API with Docker, you can use that running API instead of starting another one.
- **Need another port:** change `--port 8080` to, for example, `--port 9090`. Update the Swagger URL, Postman `baseUrl`, and JMeter `port` variable to match. The React UI also needs its API URL updated if you use it.
- **VS Code asks for an interpreter:** use **Python: Select Interpreter** and select `.venv/bin/python`.

### Repair a broken environment

If an existing environment stops working after a Python upgrade (for example,
`source` succeeds but `python` is missing, or you see `bad interpreter`), preserve
it and create a new one from this project folder:

```bash
deactivate 2>/dev/null || true
mv .venv ".venv.backup-$(date +%Y%m%d-%H%M%S)"
python3 -m venv .venv
```

Then repeat steps 3 and 4 to activate the new environment and install dependencies. If `python3`
is missing, install Python 3 before continuing.

## Endpoints

| Method | URL | Purpose |
| --- | --- | --- |
| GET | `/` | Health check |
| GET | `/api/v1/employees` | List all employees |
| POST | `/api/v1/employees` | Create an employee |
| GET | `/api/v1/employees/{employee_id}` | Get one employee |
| PUT | `/api/v1/employees/{employee_id}` | Replace an employee |
| DELETE | `/api/v1/employees/{employee_id}` | Delete an employee |

Example POST body:

```json
{
  "name": "Manish I",
  "department": "Engineering",
  "title": "Software Architect"
}
```

## Run tests

```bash
python -m pytest
```

## Postman collection

The ready-to-import Postman Collection v2.1 is available at:

`postman/collections/employee-api-crud.postman_collection.json`

1. Start the API with Uvicorn.
2. Open Postman and choose **Import**.
3. Select the collection JSON file.
4. Run the requests from the **Employees** folder in this order: **Create employee**, **Get employee**, **Update employee**, and **Delete employee**.

The collection uses `http://127.0.0.1:8080` as `baseUrl`. The **Create employee** request automatically saves the returned ID as `employeeId` for the remaining requests.
