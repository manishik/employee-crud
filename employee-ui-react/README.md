# Employee UI — React basics

A separate, beginner-friendly React frontend for the sibling `employee-api-crud`
FastAPI project. List, create, edit, and delete employees on one screen.

It uses JavaScript, React, Vite, plain CSS, and the browser's built-in `fetch`.
The structure separates responsibilities like a larger application, while keeping
the code small. No database, routing library, Redux, or UI framework is needed.

## Start here when returning to this project

You need **two terminal windows**. Keep both running while using the app.

**Terminal 1 — Python API:**

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-api-crud
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8080
```

**Terminal 2 — React UI:**

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-ui-react
npm ci
npm run dev
```

Open **<http://127.0.0.1:5173>** in your browser. Swagger is separately available
at <http://127.0.0.1:8080/docs>. Press `Control+C` in each terminal to stop it.

`npm ci` installs exactly the dependencies in `package-lock.json`. Running it
again is safe; after dependencies are installed you can skip it on subsequent
starts, unless the dependency files changed. React uses Node, so you do not
activate a Python virtual environment in the React terminal.

## First-time prerequisites and setup

1. Install a current Node.js LTS release from <https://nodejs.org/>. This project
   requires Node **22.12 or newer**. Check in a new terminal:

   ```bash
   node --version
   npm --version
   ```

2. Set up the backend if necessary:

   ```bash
   cd /Users/manishkeshav/_Work2026/Python/employee-crud/employee-api-crud
   python3 -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements.txt
   ```

   If `.venv` already exists, use the backend's [README](../employee-api-crud/README.md)
   to activate or repair it instead of recreating it blindly.

3. Follow the two-terminal startup commands above.

All React commands must run inside `employee-ui-react`, where `package.json`
lives. No API key or `.env` file is needed.

## Try the complete flow

1. Enter `Ada Lovelace`, `Engineering`, and `Software Engineer`. Click **Add employee**.
2. The employee appears in the directory. Click **Edit**, change the job title,
   and click **Save changes**. **Cancel** leaves their saved details unchanged.
3. Click **Refresh** to load the latest records from the API.
4. Click **Delete** and confirm to remove the employee.

Required fields cannot be empty or contain only spaces. The screen shows loading,
success, and API error messages. Data lives in the Python API's memory: refreshing
the browser keeps it, but stopping/restarting the API clears it. Editing Python
files with `--reload` also restarts the API.

## Project structure

```text
employee-ui-react/
├── src/
│   ├── api/
│   │   └── employeeApi.js                 # HTTP requests to FastAPI
│   ├── features/employees/
│   │   ├── EmployeePage.jsx               # State and CRUD actions
│   │   ├── EmployeeForm.jsx               # Add/edit form
│   │   └── EmployeeTable.jsx              # Directory and row buttons
│   ├── styles/global.css                 # Responsive appearance
│   ├── App.jsx                           # Top-level component
│   └── main.jsx                          # React entry point
├── index.html                            # Browser entry point
├── vite.config.js                        # Ports and API forwarding
├── package.json                          # Dependencies and commands
├── package-lock.json                     # Exact dependency versions
└── README.md
```

This is a small enterprise-style separation: API access, feature components,
application entry, and styles. Add future features alongside `features/employees`.
It is a learning project, not a production deployment with authentication or
persistent storage.

## How React works here

- **Component:** a JavaScript function that returns part of the screen.
  `EmployeeForm` and `EmployeeTable` are components.
- **JSX:** HTML-like markup inside JavaScript. Files containing it use `.jsx`.
- **Props:** values or functions passed from a parent component to a child.
  `EmployeePage` passes `onSave` to the form.
- **State:** values React remembers. `useState` stores employees, form inputs,
  and loading/error flags. Setting state makes React update the screen.
- **Effect:** `useEffect` loads employees when the page first opens.
- **Event handler:** a function run after an action such as a click or form submit.
- **Key:** identifies a rendered item. Rows use `employee.id`. The form's key
  changes when switching employees or clearing it, resetting its input state.
- **Vite:** the development server and build tool. It serves React on port 5173.
- **npm:** installs JavaScript dependencies and runs the commands in `package.json`.

Read the files in this order: `main.jsx` → `App.jsx` → `EmployeePage.jsx` →
`EmployeeForm.jsx` → `EmployeeTable.jsx` → `employeeApi.js`.

## Request flow and ports

```text
Browser (5173) → React handler → employeeApi.js
              → Vite proxy /api → FastAPI (8080) → JSON → React state → screen
```

The frontend requests `/api/v1/employees`. Vite forwards `/api` requests to
`http://127.0.0.1:8080`, preserving the path. This avoids cross-origin requests
during local development without changing the backend.

| Action | HTTP request |
| --- | --- |
| Load / refresh | `GET /api/v1/employees` |
| Add | `POST /api/v1/employees` |
| Save edits | `PUT /api/v1/employees/{id}` |
| Delete | `DELETE /api/v1/employees/{id}` |

If you change the API port, update both the Python startup command and the
proxy target in `vite.config.js`, then restart Vite. The React port stays 5173.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| `node` or `npm`: command not found | Install Node.js and open a new terminal. |
| npm cannot find `package.json` | Run the React `cd` command above. |
| Unsupported Node version | Install Node 22.12 or newer, reopen the terminal, and run `npm ci`. |
| `vite`: command not found | Run `npm ci` from the React folder. |
| Port 5173 is already in use | Stop the earlier React server with `Control+C`; Vite intentionally does not silently switch ports. |
| API error / proxy `ECONNREFUSED` | Start FastAPI on 8080 in terminal 1, verify Swagger opens, then click **Refresh**. |
| Python environment or import error | Follow the backend README's environment recovery steps and install its requirements. |
| Edits disappeared | Restarting the in-memory API clears employees. Add them again. |

## Build and preview

From the React folder:

```bash
npm run build
npm run preview
```

The build writes static files to `dist/`. Preview opens at
<http://127.0.0.1:4173>; keep the Python API running on 8080 for CRUD to work.
Preview also uses the local proxy. A deployed `dist/` needs a hosting reverse
proxy for `/api` to a deployed backend; the Vite proxy is not bundled into `dist/`.

## Official learning references

- [React quick start](https://react.dev/learn)
- [React state](https://react.dev/reference/react/useState)
- [React effects](https://react.dev/reference/react/useEffect)
- [Vite getting started](https://vite.dev/guide/)
- [Vite proxy configuration](https://vite.dev/config/server-options#server-proxy)
