from typing import Optional

from app.schemas.employee import Employee, EmployeeInput


class EmployeeService:
    """Handles employee use cases using an in-memory store."""

    def __init__(self) -> None:
        # Dictionary key: employee ID. Dictionary value: employee details.
        self._employees: dict[int, Employee] = {}

        # This number is used when a new employee is created.
        self._next_employee_id = 1

    def list_employees(self) -> list[Employee]:
        return list(self._employees.values())

    def create_employee(self, employee_data: EmployeeInput) -> Employee:
        employee = Employee(
            id=self._next_employee_id,
            name=employee_data.name,
            department=employee_data.department,
            title=employee_data.title,
        )
        self._employees[self._next_employee_id] = employee
        self._next_employee_id += 1
        return employee

    def get_employee(self, employee_id: int) -> Optional[Employee]:
        return self._employees.get(employee_id)

    def update_employee(
        self,
        employee_id: int,
        employee_data: EmployeeInput,
    ) -> Optional[Employee]:
        if employee_id not in self._employees:
            return None

        employee = Employee(
            id=employee_id,
            name=employee_data.name,
            department=employee_data.department,
            title=employee_data.title,
        )
        self._employees[employee_id] = employee
        return employee

    def delete_employee(self, employee_id: int) -> bool:
        if employee_id not in self._employees:
            return False
        del self._employees[employee_id]
        return True

    def clear(self) -> None:
        """Reset the in-memory store; useful for tests and local experimentation."""
        self._employees.clear()
        self._next_employee_id = 1


employee_service = EmployeeService()
