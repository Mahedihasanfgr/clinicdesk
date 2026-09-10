import { useState } from "react";
import { tokens } from "../styles/tokens";
import { PageHeader, Badge, Button, EmptyState, Input, Modal } from "./common";
import {
  FileText,
  Plus,
  Trash2,
  Pill,
  X,
  Sparkles,
  Save,
  AlertCircle,
  Search,
} from "lucide-react";

export default function Templates({ templates, addTemplate, deleteTemplate }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const blankRx = () => ({ medicine: "", dosage: "", duration: "", instructions: "" });
  const [form, setForm] = useState({ name: "", prescription: [blankRx()] });
  const [err, setErr] = useState("");

  const addRx = () => setForm((f) => ({ ...f, prescription: [...f.prescription, blankRx()] }));
  const rmRx = (i) => setForm((f) => ({ ...f, prescription: f.prescription.filter((_, j) => j !== i) }));
  const setRx = (i, k) => (e) =>
    setForm((f) => {
      const p = [...f.prescription];
      p[i] = { ...p[i], [k]: e.target.value };
      return { ...f, prescription: p };
    });

  const save = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      setErr("Template name is required");
      return;
    }
    await addTemplate({ ...form, id: "T-" + Date.now() });
    setShowForm(false);
    setForm({ name: "", prescription: [blankRx()] });
    setErr("");
  };

  const filtered = templates.filter((t) =>
    (t.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Create Template Modal */}
      {showForm && (
        <Modal
          isOpen={true}
          onClose={() => setShowForm(false)}
          title="Create Clinical Rx Protocol"
          subtitle="Configure frequent drug combinations for rapid 1-click prescription entry"
          icon={Sparkles}
          maxWidth={760}
        >

            {err && (
              <div
                style={{
                  background: tokens.colors.semantic.danger.bg,
                  border: `1px solid ${tokens.colors.semantic.danger.border}`,
                  color: tokens.colors.semantic.danger.text,
                  padding: "10px 14px",
                  borderRadius: tokens.radii.md,
                  fontSize: 13,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Input
                label="Template Clinical Title *"
                value={form.name}
                onChange={(e) => {
                  setErr("");
                  setForm((f) => ({ ...f, name: e.target.value }));
                }}
                placeholder="e.g. Acute Viral URI Protocol, Type 2 DM Maintenance, Hypertension"
                required
                autoFocus
              />

              <div
                style={{
                  background: tokens.colors.slate[50],
                  borderRadius: tokens.radii.lg,
                  border: `1px solid ${tokens.colors.slate[200]}`,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: tokens.colors.primary[700],
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Pill size={15} /> Included Medicines
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {form.prescription.map((rx, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 2fr 36px",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={{
                          padding: "8px 10px",
                          fontSize: 13,
                          borderRadius: tokens.radii.sm,
                          border: `1px solid ${tokens.colors.slate[300]}`,
                          outline: "none",
                        }}
                        value={rx.medicine}
                        onChange={setRx(i, "medicine")}
                        placeholder="Medicine name"
                        required
                      />
                      <input
                        style={{
                          padding: "8px 10px",
                          fontSize: 13,
                          borderRadius: tokens.radii.sm,
                          border: `1px solid ${tokens.colors.slate[300]}`,
                          outline: "none",
                        }}
                        value={rx.dosage}
                        onChange={setRx(i, "dosage")}
                        placeholder="Dosage"
                      />
                      <input
                        style={{
                          padding: "8px 10px",
                          fontSize: 13,
                          borderRadius: tokens.radii.sm,
                          border: `1px solid ${tokens.colors.slate[300]}`,
                          outline: "none",
                        }}
                        value={rx.duration}
                        onChange={setRx(i, "duration")}
                        placeholder="Duration"
                      />
                      <input
                        style={{
                          padding: "8px 10px",
                          fontSize: 13,
                          borderRadius: tokens.radii.sm,
                          border: `1px solid ${tokens.colors.slate[300]}`,
                          outline: "none",
                        }}
                        value={rx.instructions}
                        onChange={setRx(i, "instructions")}
                        placeholder="Instructions"
                      />
                      <button
                        type="button"
                        style={{
                          background: tokens.colors.semantic.danger.bg,
                          color: tokens.colors.semantic.danger.text,
                          border: `1px solid ${tokens.colors.semantic.danger.border}`,
                          padding: "8px",
                          width: 36,
                          height: 36,
                          borderRadius: tokens.radii.sm,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onClick={() => rmRx(i)}
                        disabled={form.prescription.length === 1}
                        className="btn-interactive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  style={{
                    padding: "7px 14px",
                    fontSize: 12.5,
                    borderRadius: tokens.radii.sm,
                    background: "#FFFFFF",
                    color: tokens.colors.primary[600],
                    border: `1px solid ${tokens.colors.primary[200]}`,
                    cursor: "pointer",
                    fontWeight: 700,
                    marginTop: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onClick={addRx}
                  className="btn-interactive"
                >
                  <Plus size={14} /> Add Another Drug
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={Save}>
                  Save Clinical Protocol
                </Button>
              </div>
            </form>
        </Modal>
      )}

      {/* Page Header */}
      <PageHeader
        icon={FileText}
        title="Prescription Protocols & Templates"
        count={templates.length}
        countLabel="Protocols"
        description="Pre-configure frequent drug combinations for rapid 1-click consultation orders"
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>
            New Rx Protocol
          </Button>
        }
      />

      {/* Search Toolbar */}
      <div style={{ maxWidth: 440, position: "relative" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: tokens.colors.slate[400],
          }}
        />
        <input
          style={{
            width: "100%",
            padding: "10px 14px",
            paddingLeft: 40,
            borderRadius: tokens.radii.md,
            border: `1px solid ${tokens.colors.slate[300]}`,
            background: "#FFFFFF",
            fontSize: 14,
            color: tokens.colors.slate[900],
            outline: "none",
            boxSizing: "border-box",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter protocols by clinical diagnosis or name..."
        />
      </div>

      {/* Templates Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: tokens.radii.xl,
            border: `1px solid ${tokens.colors.slate[200]}`,
            boxShadow: tokens.shadows.sm,
          }}
        >
          <EmptyState
            icon={FileText}
            color="teal"
            title={templates.length === 0 ? "No prescription protocols created yet" : "No matching protocols found"}
            description={
              templates.length === 0
                ? "Save time during patient visits by creating pre-filled drug regimens for standard conditions."
                : `No protocols match "${search}". Try searching by another keyword.`
            }
            actionLabel={templates.length === 0 ? "Create First Protocol" : "Clear Filter"}
            actionIcon={Plus}
            onAction={() => {
              if (templates.length === 0) setShowForm(true);
              else setSearch("");
            }}
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filtered.map((t) => (
            <div
              key={t.id}
              className="card-hover"
              style={{
                background: "#FFFFFF",
                borderRadius: tokens.radii.xl,
                border: `1px solid ${tokens.colors.slate[200]}`,
                padding: "22px 24px",
                boxShadow: tokens.shadows.sm,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: tokens.radii.md,
                        background: tokens.colors.primary[50],
                        color: tokens.colors.primary[600],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Pill size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15.5, fontWeight: 700, color: tokens.colors.slate[900], margin: 0 }}>
                        {t.name}
                      </h3>
                      <span style={{ fontSize: 12, color: tokens.colors.slate[500] }}>
                        {(t.prescription || []).length} Medicines Included
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete protocol "${t.name}"?`)) {
                        deleteTemplate(t.id);
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: tokens.colors.slate[400],
                      cursor: "pointer",
                      padding: 4,
                      borderRadius: 6,
                    }}
                    className="btn-interactive"
                    title="Delete Protocol"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div
                  style={{
                    background: tokens.colors.slate[50],
                    borderRadius: tokens.radii.md,
                    padding: "12px 14px",
                    border: `1px solid ${tokens.colors.slate[200]}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {(t.prescription || []).map((rx, idx) => (
                    <div
                      key={idx}
                      style={{
                        fontSize: 12.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: tokens.colors.slate[700],
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>• {rx.medicine || "Drug"}</span>
                      <span style={{ color: tokens.colors.slate[500], fontSize: 12 }}>
                        {rx.dosage} {rx.duration && `(${rx.duration})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Badge variant="teal" size="sm">
                  Ready for Consultations
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
