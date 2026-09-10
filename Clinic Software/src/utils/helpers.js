let ptCounter = 3;
let visitCounter = 10;
let aptCounter = 10;

export const newPatientId = () => `PT-${String(++ptCounter).padStart(3, "0")}`;
export const newVisitId = () => `V-${String(++visitCounter).padStart(3, "0")}`;
export const newAptId = () => `APT-${String(++aptCounter).padStart(3, "0")}`;

export const today = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
// Parse date string as local date (avoids UTC-to-local timezone shift)
const parseLocalDate = (d) => {
  if (!d) return null;
  const str = d.toString().slice(0, 10); // get "YYYY-MM-DD" part
  const [y, m, day] = str.split("-").map(Number);
  return new Date(y, m - 1, day);
};

export const fmtDate = (d) => d ? parseLocalDate(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
