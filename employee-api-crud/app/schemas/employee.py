from pydantic import BaseModel, Field


class EmployeeInput(BaseModel):
    """Fields needed when creating or updating an employee."""

    name: str = Field(min_length=1, examples=["Ada Lovelace"])
    department: str = Field(min_length=1, examples=["Engineering"])
    title: str = Field(min_length=1, examples=["Software Engineer"])


class Employee(EmployeeInput):
    """Employee fields returned by the API, including the ID."""

    id: int
