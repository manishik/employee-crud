from fastapi import FastAPI

from app.api.routes.employees import router as employees_router


app = FastAPI(
    title="Employee CRUD API",
    description="A simple in-memory employee management API.",
    version="1.0.0",
)


@app.get("/", tags=["Health"])
def read_root() -> dict[str, str]:
    return {"message": "Employee CRUD API is running"}


# All employee endpoints now start with /api/v1.
app.include_router(employees_router, prefix="/api/v1")
