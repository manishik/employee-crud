import { useState } from 'react';

export default function EmployeeForm({ employee, onSave, onCancel, busy }) {
  const [values, setValues] = useState({
    name: employee?.name ?? '',
    department: employee?.department ?? '',
    title: employee?.title ?? '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));
    if (Object.values(trimmed).some((value) => !value)) return;
    onSave(trimmed);
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <p className="eyebrow">EMPLOYEE DETAILS</p>
      <h2 id="form-title">{employee ? 'Edit employee' : 'Add an employee'}</h2>
      <p className="muted">{employee ? 'Update their details below.' : 'Welcome someone new to the directory.'}</p>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={busy}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={values.name} onChange={handleChange} placeholder="e.g. Ada Lovelace" required pattern=".*\S.*" />
          <label htmlFor="department">Department</label>
          <input id="department" name="department" value={values.department} onChange={handleChange} placeholder="e.g. Engineering" required pattern=".*\S.*" />
          <label htmlFor="title">Job title</label>
          <input id="title" name="title" value={values.title} onChange={handleChange} placeholder="e.g. Software Engineer" required pattern=".*\S.*" />
          <div className="form-actions">
            <button className="primary" type="submit">{busy ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}</button>
            {employee && <button type="button" onClick={onCancel}>Cancel</button>}
          </div>
        </fieldset>
      </form>
    </section>
  );
}
