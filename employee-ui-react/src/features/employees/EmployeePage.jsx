import { useEffect, useState } from 'react';
import { employeeApi } from '../../api/employeeApi.js';
import EmployeeForm from './EmployeeForm.jsx';
import EmployeeTable from './EmployeeTable.jsx';

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formVersion, setFormVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadEmployees() {
    setLoading(true);
    setError('');
    try { setEmployees(await employeeApi.list()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  // Load the directory once when this screen opens.
  useEffect(() => { loadEmployees(); }, []);

  function resetForm() {
    setEditing(null);
    setFormVersion((version) => version + 1);
  }

  async function saveEmployee(values) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const saved = editing ? await employeeApi.update(editing.id, values) : await employeeApi.create(values);
      setEmployees((current) => editing ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setMessage(editing ? 'Employee updated.' : 'Employee added.');
      resetForm();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.name}? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await employeeApi.remove(employee.id);
      setEmployees((current) => current.filter((item) => item.id !== employee.id));
      if (editing?.id === employee.id) resetForm();
      setMessage('Employee deleted.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <>
      <header className="topbar"><div className="brand"><span className="brand-icon" aria-hidden="true">e</span>Employee workspace</div><span className="topbar-note">People & teams</span></header>
      <main>
        <div className="page-heading"><div><p className="eyebrow">YOUR TEAM, IN ONE PLACE</p><h1>Employee directory</h1><p className="muted">Keep your team's details organized and up to date.</p></div><div className="count"><strong>{employees.length}</strong><span>employees</span></div></div>
        {error && <div className="notice error" role="alert">{error}</div>}
        {message && <div className="notice success" role="status">{message}</div>}
        <div className="workspace">
          <EmployeeForm key={formVersion} employee={editing} onSave={saveEmployee} onCancel={resetForm} busy={busy || loading} />
          <section className="panel directory" aria-labelledby="directory-title" aria-busy={loading}>
            <div className="directory-heading"><div><h2 id="directory-title">All employees</h2><p className="muted">View and manage your team.</p></div><button onClick={loadEmployees} disabled={loading || busy}>{loading ? 'Loading…' : 'Refresh'}</button></div>
            {loading ? <div className="empty" role="status">Loading employees…</div> : <EmployeeTable employees={employees} onEdit={(employee) => { setEditing(employee); setFormVersion((version) => version + 1); setMessage(''); }} onDelete={deleteEmployee} busy={busy} />}
          </section>
        </div>
        <footer>Employees are stored in memory. Restarting the API clears the directory.</footer>
      </main>
    </>
  );
}
