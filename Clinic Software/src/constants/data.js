import { today } from "../utils/helpers";

export const SEED_PATIENTS = [
  {
    id: "PT-001", name: "Anita Sharma", age: 34, gender: "Female",
    contact: "9876543210", email: "anita@email.com", address: "12 MG Road, Mumbai",
    bloodGroup: "B+", createdAt: "2024-01-10",
    visits: [
      {
        id: "V-001", date: "2024-03-15", symptoms: "Fever, headache, body ache for 3 days",
        diagnosis: "Viral fever", notes: "Advised rest and plenty of fluids",
        vitals: { bp: "118/76", sugar: "Normal", temp: "101.2°F", weight: "58 kg", pulse: "88" },
        prescription: [
          { medicine: "Paracetamol 500mg", dosage: "1 tablet", duration: "5 days", instructions: "After food, every 8 hours" },
          { medicine: "Cetirizine 10mg", dosage: "1 tablet", duration: "3 days", instructions: "At bedtime" }
        ],
        attachments: [], fee: 500
      }
    ]
  },
  {
    id: "PT-002", name: "Rajesh Kumar", age: 52, gender: "Male",
    contact: "9123456780", email: "rajesh@email.com", address: "45 Linking Road, Bandra",
    bloodGroup: "O+", createdAt: "2023-11-20",
    visits: [
      {
        id: "V-002", date: "2024-02-10", symptoms: "Persistent cough, chest congestion, mild breathlessness",
        diagnosis: "Bronchitis", notes: "Referred for chest X-ray. Follow up in 1 week.",
        vitals: { bp: "138/88", sugar: "126 mg/dL", temp: "99.8°F", weight: "78 kg", pulse: "92" },
        prescription: [
          { medicine: "Azithromycin 500mg", dosage: "1 tablet", duration: "5 days", instructions: "Once daily after food" },
          { medicine: "Salbutamol Inhaler", dosage: "2 puffs", duration: "7 days", instructions: "As needed for breathing difficulty" }
        ],
        attachments: [], fee: 700
      },
      {
        id: "V-003", date: "2024-03-01", symptoms: "Follow-up – cough improved, mild fatigue",
        diagnosis: "Recovering bronchitis", notes: "Chest clear. Advised to complete course.",
        vitals: { bp: "130/82", sugar: "118 mg/dL", temp: "98.6°F", weight: "78 kg", pulse: "78" },
        prescription: [
          { medicine: "Multivitamin", dosage: "1 tablet", duration: "30 days", instructions: "Morning after breakfast" }
        ],
        attachments: [], fee: 400
      }
    ]
  }
];

export const SEED_APPOINTMENTS = [
  { id: "APT-001", patientId: "PT-001", patientName: "Anita Sharma", date: today(), time: "10:00", reason: "Follow-up checkup", status: "confirmed" },
  { id: "APT-002", patientId: "PT-002", patientName: "Rajesh Kumar", date: today(), time: "11:30", reason: "Sugar level review", status: "confirmed" },
  { id: "APT-003", patientId: "PT-001", patientName: "Anita Sharma", date: today(), time: "14:00", reason: "General checkup", status: "waiting" },
];

export const SEED_TEMPLATES = [
  { id: "T-001", name: "Common Cold", prescription: [{ medicine: "Paracetamol 500mg", dosage: "1 tablet", duration: "5 days", instructions: "After food, every 8 hrs" }, { medicine: "Cetirizine 10mg", dosage: "1 tablet", duration: "3 days", instructions: "At bedtime" }, { medicine: "Cough syrup", dosage: "10 ml", duration: "5 days", instructions: "3 times daily after food" }] },
  { id: "T-002", name: "Hypertension Follow-up", prescription: [{ medicine: "Amlodipine 5mg", dosage: "1 tablet", duration: "30 days", instructions: "Once daily morning" }, { medicine: "Telmisartan 40mg", dosage: "1 tablet", duration: "30 days", instructions: "Once daily morning" }] },
];
