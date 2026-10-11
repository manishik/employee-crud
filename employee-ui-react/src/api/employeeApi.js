const EMPLOYEES_URL = '/api/v1/employees';

// All HTTP details stay here so components can focus on the screen.
async function request(path = '', options = {}) {
  let response;
  try {
    response = await fetch(`${EMPLOYEES_URL}${path}`, options);
  } catch {
    throw new Error('Cannot reach the API. Start FastAPI on port 8080, then refresh.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail;
    if (typeof detail === 'string') throw new Error(detail);
    if (Array.isArray(detail)) {
      throw new Error(detail.map((item) => `${item.loc.at(-1)}: ${item.msg}`).join('; '));
    }
    throw new Error('Request failed. Check that FastAPI is running on port 8080, then try again.');
  }

  // DELETE returns 204: there is no JSON body to read.
  return response.status === 204 ? null : response.json();
}

function jsonOptions(method, employee) {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(employee) };
}

export const employeeApi = {
  list: () => request(),
  create: (employee) => request('', jsonOptions('POST', employee)),
  update: (id, employee) => request(`/${id}`, jsonOptions('PUT', employee)),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
