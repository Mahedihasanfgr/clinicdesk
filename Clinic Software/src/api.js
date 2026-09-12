const BASE = import.meta.env.VITE_API_URL || "/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// AUTH
export const apiLogin = (username, password, clinicCode) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, clinicCode }),
  }).then(r => r.json());

export const apiRegisterClinic = (data) =>
  fetch(`${BASE}/clinics/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

// PATIENTS
export const apiGetPatients = () =>
  fetch(`${BASE}/patients`, { headers: headers() }).then(r => r.json());

export const apiAddPatient = (data) =>
  fetch(`${BASE}/patients`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const apiUpdatePatient = (id, data) =>
  fetch(`${BASE}/patients/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const apiAddVisit = (patientId, data) =>
  fetch(`${BASE}/patients/${patientId}/visits`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// APPOINTMENTS
export const apiGetAppointments = () =>
  fetch(`${BASE}/appointments`, { headers: headers() }).then(r => r.json());

export const apiAddAppointment = (data) =>
  fetch(`${BASE}/appointments`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const apiUpdateAppointment = (id, status) =>
  fetch(`${BASE}/appointments/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify({ status }) }).then(r => r.json());

export const apiDeleteAppointment = (id) =>
  fetch(`${BASE}/appointments/${id}`, { method: "DELETE", headers: headers() }).then(r => r.json());

// TEMPLATES
export const apiGetTemplates = () =>
  fetch(`${BASE}/templates`, { headers: headers() }).then(r => r.json());

export const apiAddTemplate = (data) =>
  fetch(`${BASE}/templates`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const apiDeleteTemplate = (id) =>
  fetch(`${BASE}/templates/${id}`, { method: "DELETE", headers: headers() }).then(r => r.json());

export const apiSendWhatsApp = (patient, visit) =>
  fetch(`${BASE}/whatsapp/send`, { method: "POST", headers: headers(), body: JSON.stringify({ patient, visit }) }).then(r => r.json());

export const apiGetWhatsAppBotStatus = () =>
  fetch(`${BASE}/whatsapp/bot-status`, { headers: headers() }).then(r => r.json());

export const apiSetWhatsAppClinic = () =>
  fetch(`${BASE}/whatsapp/set-clinic`, { method: "POST", headers: headers() }).then(r => r.json());

export const apiTestWhatsAppBot = (text, phone) =>
  fetch(`${BASE}/whatsapp/test-bot`, { method: "POST", headers: headers(), body: JSON.stringify({ text, phone }) }).then(r => r.json());


export const apiWhatsAppStatus = () =>
  fetch(`${BASE}/whatsapp/status`, { headers: headers() }).then(r => r.json());
