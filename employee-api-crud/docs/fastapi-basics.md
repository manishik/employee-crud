# FastAPI Basics

This page explains how the main pieces of this project fit together.

## Python

Python is the programming language used to write the application code.

For example:

```python
name = "Ada"
```

The variable `name` stores the text `Ada`.

## Virtual environment

`.venv` is a private Python environment for this project. It contains the packages the project needs, such as FastAPI and Uvicorn.

### Why do we need it?

Different Python projects may need different package versions. For example, one project might need an older FastAPI version while another needs a newer version.

Without a virtual environment, packages would be installed into one shared Python installation. Projects could then affect each other when packages are added or upgraded.

With `.venv`:

- This project keeps its own dependencies.
- Installing a package does not change the global Python installation.
- The project can be recreated using `requirements.txt`.
- Everyone working on the project can use the same dependency list.

The closest Java comparison is a project-specific Maven or Gradle dependency setup. `.venv` is the isolated environment, while `requirements.txt` is similar to the dependency list in `pom.xml` or `build.gradle`.

Activate it before running commands:

```bash
source .venv/bin/activate
```

When you are finished, you can leave the environment with:

```bash
deactivate
```

## FastAPI

FastAPI is a Python framework for building web APIs.

In this project, [main.py](../app/main.py) creates the FastAPI application, and [employees.py](../app/api/routes/employees.py) defines the employee endpoints.

For example, this route responds to `GET /`:

```python
@app.get("/")
def read_root():
    return {"message": "Employee CRUD API is running"}
```

## Uvicorn

Uvicorn is the web server that runs the FastAPI application and listens for HTTP requests.

```bash
python -m uvicorn app.main:app --reload --port 8080
```

This means:

- `app.main` means the `app/main.py` file.
- `:app` means the FastAPI variable named `app` inside that file.
- `--reload` restarts the server when code changes.

The flow is:

```text
Browser/Postman -> Uvicorn -> FastAPI route -> Python function -> JSON response
```

## Schemas and Swagger

Pydantic models in [employee.py](../app/schemas/employee.py) describe and validate employee data.

FastAPI uses those models to automatically create Swagger documentation at:

<http://127.0.0.1:8080/docs>

You can send requests from Swagger without writing a separate client application.

## Spring Boot comparison

The rough equivalent is:

| This project | Spring Boot idea |
| --- | --- |
| FastAPI | Web framework |
| Uvicorn | Application web server |
| Route function | Controller method |
| Pydantic model | Request/response DTO |
| Swagger at `/docs` | OpenAPI/Swagger UI |

## Enterprise deployment

The enterprise deployment flow is very similar to Spring Boot:

```text
Python code
    -> Docker image
    -> Kubernetes Deployment
    -> Kubernetes Pod(s)
    -> Kubernetes Service
    -> Ingress or API Gateway
    -> Client
```

### 1. Docker

The project is packaged into a Docker image. The image contains:

- The Python runtime
- The application code
- `requirements.txt` dependencies
- The command used to start Uvicorn

The image is built once and stored in a container registry, similar to storing a Spring Boot JAR or container image.

### 2. Kubernetes Deployment

A Kubernetes `Deployment` starts one or more copies of the Docker image. Each copy runs in a Pod.

For this API, a Pod would run the FastAPI application through Uvicorn. More replicas can be started when more traffic is needed.

### 3. Service and Ingress

- A Kubernetes `Service` gives the Pods a stable internal address and distributes traffic between them.
- An `Ingress` or API Gateway exposes the API to clients and can handle HTTPS, routing, and authentication.

This is similar to placing a Spring Boot service behind a load balancer or API gateway.

### 4. Configuration

Environment variables are commonly used for deployment settings such as:

- Port numbers
- Database URLs
- Log levels
- Feature flags

Sensitive values such as passwords and tokens are stored in Kubernetes `Secrets`. Non-sensitive settings are commonly stored in `ConfigMaps`.

### 5. Health checks, logs, and scaling

Enterprise deployments normally add:

- Health endpoints for Kubernetes startup, readiness, and liveness probes
- Centralized application logs instead of writing important logs only to local files
- Metrics and tracing for monitoring
- Horizontal scaling by increasing the number of Pod replicas

The main difference from Spring Boot is the framework and runtime vocabulary. The deployment ideas—container image, environment configuration, health checks, logs, monitoring, and Kubernetes replicas—are largely the same.
