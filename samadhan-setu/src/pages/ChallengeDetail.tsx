import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDatabase } from "../hooks/useDatabase";
import { useAuth } from "../context/AuthContext";
import {
  Badge,
  PageTitle,
  Empty,
  Timeline,
  Field,
  Message,
  Modal,
  Progress,
} from "../components/UI";
import { Attachments } from "../components/ImageUpload";
import { solutionService, type UptakeData } from "../services/solutionService";
import { challengeService } from "../services/challengeService";
import { universityService } from "../services/universityService";
import type { ReviewStatus } from "../types";
export default function ChallengeDetail() {
  const { id } = useParams();
  const db = useDatabase();
  const { user } = useAuth();
  const nav = useNavigate();
  const [modal, setModal] = useState<"uptake" | "decline" | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const c = db.challenges.find((c) => c.id === id);
  const [data, setData] = useState<UptakeData>({
    title: c?.title || "",
    department: "",
    mentor: "",
    teamId: "",
    duration: 6,
    approach: "",
    lab: "",
    notes: "",
  });
  if (!c || !user || (user.role === "citizen" && c.citizenId !== user.id))
    return <Empty text="Challenge not found or unavailable to this account." />;
  const uni = user.role === "university";
  const match = db.matches.find(
    (m) => m.challengeId === id && m.universityId === user.universityId,
  );
  const project = db.projects.find((p) => p.challengeId === id);
  const teams = db.teams.filter((t) => t.universityId === user.universityId);
  const available =
    uni &&
    match &&
    !match.declined &&
    !c.universityId &&
    ["Matched", "Validated"].includes(c.reviewStatus);
  const act = (fn: () => void, message: string) => {
    setError("");
    try {
      fn();
      setSuccess(message);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const update = (key: keyof UptakeData, value: string | number) =>
    setData({ ...data, [key]: value });
  return (
    <>
      <PageTitle
        title={c.title}
        description={`${c.id} · Submitted ${c.date} · ${c.submittedBy}`}
      />
      <Message error={error} success={success} />
      <div className="detail-badges">
        <Badge>{c.status}</Badge>
        <Badge>{c.priority} priority</Badge>
        <span>{c.category}</span>
        {match && (
          <strong className="match-score">
            {match.matchScore}% {match.declined ? "· Declined" : "match"}
          </strong>
        )}
      </div>
      {project && (
        <div className="highlight-strip">
          <div>
            <strong>
              {db.universities.find((u) => u.id === project.universityId)?.name}
            </strong>
            <p>
              {project.status} · Target completion {project.targetDate}
            </p>
            <Progress value={project.progress} />
          </div>
          {user.role !== "citizen" && (
            <Link to={`/${user.role}/projects/${project.id}`}>
              Open solution project →
            </Link>
          )}
        </div>
      )}
      <div className="detail-grid">
        <div>
          <section className="panel">
            <h2>The community challenge</h2>
            <p className="prose">{c.description}</p>
            <div className="facts">
              <Fact label="District" value={c.district} />
              <Fact label="Block" value={c.block} />
              <Fact label="Village / Ward" value={c.village} />
              <Fact
                label="People affected"
                value={c.population.toLocaleString()}
              />
              <Fact label="Location" value={c.location} />
              <Fact label="Problem duration" value={c.duration} />
            </div>
            <h3>Current attempts</h3>
            <p>{c.attempts || "Not specified."}</p>
            <h3>Expected outcome</h3>
            <p>{c.outcome}</p>
            <h3>Photographs & supporting documents</h3>
            <Attachments files={c.attachments} />
          </section>
          <section className="panel">
            <h2>Government validation</h2>
            <Badge>{c.reviewStatus}</Badge>
            <p>
              {c.reviewNote || "Awaiting review by the state innovation team."}
            </p>
            {user.role === "government" && !c.universityId && (
              <>
                <Field label="Review note / reason">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Explain the decision or information needed"
                  />
                </Field>
                <div className="actions">
                  {(
                    [
                      "Validated",
                      "Needs More Information",
                      "Rejected",
                    ] as ReviewStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      className={
                        status === "Validated" ? "primary" : "secondary"
                      }
                      onClick={() =>
                        act(
                          () => challengeService.review(c.id, status, note),
                          status === "Validated"
                            ? "Challenge validated. Mock matches and eligible university notifications created."
                            : "Review saved.",
                        )
                      }
                    >
                      {status === "Validated"
                        ? "Validate & match"
                        : status === "Rejected"
                          ? "Reject"
                          : "Request information"}
                    </button>
                  ))}
                </div>
                <p className="muted">Submitter contact: {c.contact}</p>
              </>
            )}
          </section>
          {user.role === "government" && (
            <section className="panel">
              <h2>University matches</h2>
              {db.matches
                .filter((m) => m.challengeId === id)
                .map((m) => (
                  <div className="list-row" key={m.universityId}>
                    <span>
                      {
                        db.universities.find((u) => u.id === m.universityId)
                          ?.name
                      }
                    </span>
                    <strong>{m.matchScore}%</strong>
                    <span>
                      {m.declined ? "Declined" : m.matchingDomains.join(", ")}
                    </span>
                  </div>
                ))}
            </section>
          )}
        </div>
        <aside>
          <section className="panel">
            <h2>Challenge timeline</h2>
            <Timeline history={c.history} />
            {project && <Timeline history={project.history} />}
          </section>
          {uni && (
            <section className="panel">
              <h2>Institutional response</h2>
              {match && (
                <>
                  <p>
                    <strong>{match.matchScore}% relevance</strong>
                  </p>
                  <p className="muted">
                    {match.matchingDomains.join(", ")} ·{" "}
                    {match.matchingExpertise.join(", ")}
                  </p>
                </>
              )}
              {available ? (
                <>
                  <button
                    className="primary full"
                    onClick={() => setModal("uptake")}
                  >
                    Take Up Challenge
                  </button>
                  <button
                    className="secondary full mt-3"
                    onClick={() => setModal("decline")}
                  >
                    Decline challenge
                  </button>
                </>
              ) : (
                <p className="muted">
                  {c.universityId
                    ? "This challenge has been assigned."
                    : match?.declined
                      ? "Your institution declined this challenge."
                      : "This challenge is not currently available for uptake."}
                </p>
              )}
            </section>
          )}
        </aside>
      </div>
      {modal === "decline" && (
        <Modal title="Decline this challenge?" onClose={() => setModal(null)}>
          <p>The challenge will be removed from your default matched list.</p>
          <div className="actions">
            <button className="secondary" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button
              className="danger-button"
              onClick={() =>
                act(() => {
                  universityService.decline(c.id);
                  setModal(null);
                }, "Challenge declined.")
              }
            >
              Confirm decline
            </button>
          </div>
        </Modal>
      )}
      {modal === "uptake" && (
        <Modal title="Take up challenge" onClose={() => setModal(null)}>
          <p>
            Confirm your institution’s initial commitment and create a solution
            project.
          </p>
          <Message error={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              act(() => {
                const p = solutionService.takeUpChallenge(
                  c.id,
                  user.universityId!,
                  data,
                );
                nav(`/university/projects/${p.id}`);
              }, "");
            }}
          >
            <div className="form-grid">
              <Field label="Project title *" wide>
                <input
                  required
                  value={data.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </Field>
              <Field label="Department *">
                <input
                  required
                  value={data.department}
                  onChange={(e) => update("department", e.target.value)}
                />
              </Field>
              <Field label="Faculty mentor *">
                <input
                  required
                  value={data.mentor}
                  onChange={(e) => update("mentor", e.target.value)}
                />
              </Field>
              <Field label="Project team *">
                <select
                  required
                  value={data.teamId}
                  onChange={(e) => update("teamId", e.target.value)}
                >
                  <option value="">Select team</option>
                  {teams.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Expected duration (months) *">
                <input
                  required
                  type="number"
                  min="1"
                  max="60"
                  value={data.duration}
                  onChange={(e) => update("duration", Number(e.target.value))}
                />
              </Field>
              <Field label="Research group / lab">
                <input
                  value={data.lab}
                  onChange={(e) => update("lab", e.target.value)}
                />
              </Field>
              <Field label="Optional notes">
                <input
                  value={data.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </Field>
              <Field label="Initial approach * (at least 20 characters)" wide>
                <textarea
                  required
                  minLength={20}
                  value={data.approach}
                  onChange={(e) => update("approach", e.target.value)}
                />
              </Field>
            </div>
            <p className="muted">
              Need a new team?{" "}
              <Link to="/university/teams">Create your team first</Link>, then
              return to this challenge.
            </p>
            <div className="actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button className="primary">
                Confirm uptake & create project
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Fact({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || "Not specified"}</dd>
    </div>
  );
}
