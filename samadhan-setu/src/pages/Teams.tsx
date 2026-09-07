import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../hooks/useDatabase";
import { teamService } from "../services/teamService";
import { uid } from "../services/storage";
import type { Team } from "../types";
import { PageTitle, Field, Modal, Message, Empty } from "../components/UI";
export default function Teams() {
  const { user } = useAuth();
  const db = useDatabase();
  const [editing, setEditing] = useState<Team | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  if (!user) return null;
  const teams = db.teams.filter((t) => t.universityId === user.universityId);
  const set = (key: keyof Team, value: string) =>
    setEditing(editing ? { ...editing, [key]: value } : null);
  return (
    <>
      <PageTitle
        title="Project Teams"
        description="Build multidisciplinary groups around shared expertise."
        action={
          <button
            className="primary"
            onClick={() => {
              setError("");
              setEditing({
                id: uid("TEAM"),
                universityId: user.universityId!,
                name: "",
                description: "",
                departments: "",
                lab: "",
                mentor: "",
                coMentor: "",
                expertise: "",
                members: [],
              });
            }}
          >
            <Plus size={18} />
            Create team
          </button>
        }
      />
      <Message success={success} />
      <div className="two-col">
        {teams.map((t) => (
          <section className="panel" key={t.id}>
            <div className="section-title">
              <Users size={23} />
              <button
                className="secondary"
                onClick={() => {
                  setError("");
                  setEditing(structuredClone(t));
                }}
              >
                Edit team
              </button>
            </div>
            <h2>{t.name}</h2>
            <p>{t.description}</p>
            <dl className="facts">
              <div>
                <dt>Departments</dt>
                <dd>{t.departments}</dd>
              </div>
              <div>
                <dt>Research group / lab</dt>
                <dd>{t.lab || "Not specified"}</dd>
              </div>
              <div>
                <dt>Faculty mentor</dt>
                <dd>{t.mentor}</dd>
              </div>
              <div>
                <dt>Co-mentor</dt>
                <dd>{t.coMentor || "None"}</dd>
              </div>
            </dl>
            <h3>Areas of expertise</h3>
            <p>{t.expertise || "Not specified"}</p>
            <h3>Student members · {t.members.length}</h3>
            {t.members.map((m) => (
              <div className="list-row" key={m.id}>
                <strong>{m.name}</strong>
                <span>
                  {m.department} · {m.role}
                </span>
              </div>
            ))}
          </section>
        ))}
      </div>
      {!teams.length && (
        <Empty text="Create a team before taking up your first challenge." />
      )}
      {editing && (
        <Modal
          title={
            teams.some((t) => t.id === editing.id) ? "Edit team" : "Create team"
          }
          onClose={() => setEditing(null)}
        >
          <Message error={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                teamService.save(editing);
                setEditing(null);
                setSuccess("Team saved.");
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            <div className="form-grid">
              {(
                [
                  ["name", "Team name *"],
                  ["departments", "Departments"],
                  ["lab", "Research group / lab"],
                  ["mentor", "Faculty mentor *"],
                  ["coMentor", "Co-mentor"],
                  ["expertise", "Areas of expertise"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    required={key === "name" || key === "mentor"}
                    value={editing[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                </Field>
              ))}
              <Field label="Team description *" wide>
                <textarea
                  required
                  value={editing.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
            </div>
            <h3>Student members</h3>
            {editing.members.map((m, i) => (
              <div className="member-editor" key={m.id}>
                {(["name", "department", "role"] as const).map((key) => (
                  <Field
                    label={`${key} ${key !== "department" ? "*" : ""}`}
                    key={key}
                  >
                    <input
                      required={key !== "department"}
                      value={m[key]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          members: editing.members.map((x, j) =>
                            j === i ? { ...x, [key]: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </Field>
                ))}
                <button
                  className="secondary"
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      members: editing.members.filter((x) => x.id !== m.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="secondary"
              type="button"
              onClick={() =>
                setEditing({
                  ...editing,
                  members: [
                    ...editing.members,
                    { id: uid("MEM"), name: "", department: "", role: "" },
                  ],
                })
              }
            >
              <Plus size={16} />
              Add member
            </button>
            <div className="actions">
              <button
                className="secondary"
                type="button"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button className="primary">Save team</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
