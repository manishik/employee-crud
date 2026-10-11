from fastapi import APIRouter, HTTPException, status

from app.schemas.employee import Employee, EmployeeInput
from app.services.employee_service import employee_service


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=list[Employee])
def list_employees() -> list[Employee]:
    return employee_service.list_employees()


@router.post("", response_model=Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee_data: EmployeeInput) -> Employee:
    return employee_service.create_employee(employee_data)


@router.get("/{employee_id}", response_model=Employee)
def get_employee(employee_id: int) -> Employee:
    employee = employee_service.get_employee(employee_id)
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.put("/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, employee_data: EmployeeInput) -> Employee:
    employee = employee_service.update_employee(employee_id, employee_data)
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int) -> None:
    if not employee_service.delete_employee(employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
