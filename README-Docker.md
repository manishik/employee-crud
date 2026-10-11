# Run Employee CRUD with Docker

Start both the React UI and FastAPI API with one command. You do not need to
install Python, Node, npm dependencies, or a virtual environment on your machine
for this mode.

## First-time prerequisite

Install and start [Docker Desktop](https://docs.docker.com/desktop/).
Wait until its engine is running. In a terminal, check:

```bash
docker --version
docker compose version
docker info
```

On Linux, Docker Engine with the Compose plugin also works. Use `docker compose`
(with a space), as shown throughout this README.

## Start both projects — including when returning later

Stop any manually started API or React servers first with `Control+C` in their
terminals: Docker uses the same host ports, 8080 and 5173.

```bash
cd /Users/manishkeshav/_Work2026/Python/employee-crud
docker compose up
```

On the first run Docker downloads base images, installs dependencies inside
images, and builds both projects. This needs internet access and can take a few
minutes. Later runs reuse the images. Keep the terminal open; logs from both
services appear there. The UI starts after the API passes its health check.

Open:

- **React UI:** <http://127.0.0.1:5173>
- **API Swagger:** <http://127.0.0.1:8080/docs>
- **API health:** <http://127.0.0.1:8080/>

Add an employee, edit it, and delete it to try the complete flow.

## Stop, restart, and rebuild

Press `Control+C` to stop an attached `docker compose up`. To remove the stopped
containers and project network:

```bash
docker compose down
```

To run in the background instead:

```bash
docker compose up -d
docker compose ps
docker compose logs -f
```

`Control+C` while following logs only stops log viewing; use `docker compose down`
to stop background containers.

After changing source code, dependencies, Dockerfiles, or Nginx configuration:

```bash
docker compose up --build
```

There is no live reload in Docker mode. The code is copied into images, so plain
`docker compose up` reuses an existing image until you rebuild it. For live reload,
follow the [manual setup README](README.md).

**Employee data is in API process memory. Stopping, restarting, or rebuilding the
API clears all employees.** Docker does not add a database or persistent storage.

## What each file does

| File | Purpose |
| --- | --- |
| `compose.yaml` | Builds and starts `api` and `ui`, publishes ports, and checks health. |
| `employee-api-crud/Dockerfile` | Installs Python requirements and runs Uvicorn on container port 8080. |
| `employee-ui-react/Dockerfile` | Builds React with Node, then serves the build with Nginx. |
| `employee-ui-react/nginx.conf` | Serves the UI and forwards `/api/` requests to the API container. |
| Each project's `.dockerignore` | Excludes local environments, dependencies, and other unnecessary files from build context. |

```text
Browser → localhost:5173 → UI container (Nginx)
                            └── /api/v1/employees → api:8080 (FastAPI)
Browser → localhost:8080/docs → API Swagger
```

The browser uses relative `/api` URLs. Nginx forwards those requests on Docker's
internal network to the service named `api`. No browser CORS change is required.
Vite is used only to build the UI in Docker; it is not the running web server.
The internal API binds to `0.0.0.0` so another container can reach it; published
host ports bind to `127.0.0.1` for local use.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `docker`: command not found | Install Docker Desktop and reopen the terminal. |
| Cannot connect to Docker daemon | Start Docker Desktop and wait for the engine; check `docker info`. |
| No configuration file found | Run the `cd` command above; `compose.yaml` is in `employee-crud`. |
| Port already allocated / address in use | Stop the earlier local server or container using 8080 or 5173, then retry. |
| Image download or dependency install fails | Check internet access and retry `docker compose up --build`. |
| API unhealthy or UI cannot load employees | Run `docker compose ps` and `docker compose logs api ui` to see the failure. |
| Source edits are not appearing | Run `docker compose up --build`; Docker mode has no live reload. |

To use different host ports without editing files:

```bash
API_PORT=8081 UI_PORT=5174 docker compose up
```

Then use UI port 5174 and Swagger port 8081 in your browser. The default command
still uses 8080 and 5173. Internal container ports stay unchanged; Nginx connects
to the API's internal port 8080.

## Official references

- [Compose quick start](https://docs.docker.com/compose/gettingstarted/)
- [Compose startup order and health checks](https://docs.docker.com/compose/how-tos/startup-order/)
- [Nginx reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
