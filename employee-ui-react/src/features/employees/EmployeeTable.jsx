export default function EmployeeTable({ employees, onEdit, onDelete, busy }) {
  if (employees.length === 0) {
    return <div className="empty"><span className="empty-icon" aria-hidden="true">＋</span><h3>Your directory starts here</h3><p>Add your first employee using the form.</p></div>;
  }

  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">Employees and available actions</caption>
        <thead><tr><th>Employee</th><th>Department</th><th>Job title</th><th>Actions</th></tr></thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td><div className="person"><span className="avatar" aria-hidden="true">{employee.name.charAt(0).toUpperCase()}</span><div><strong>{employee.name}</strong><small>ID {employee.id}</small></div></div></td>
              <td><span className="badge">{employee.department}</span></td>
              <td>{employee.title}</td>
              <td><div className="row-actions"><button disabled={busy} onClick={() => onEdit(employee)} aria-label={`Edit ${employee.name}`}>Edit</button><button className="danger" disabled={busy} onClick={() => onDelete(employee)} aria-label={`Delete ${employee.name}`}>Delete</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
