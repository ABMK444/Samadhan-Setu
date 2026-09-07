import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDatabase } from "../hooks/useDatabase";
import { useAuth } from "../context/AuthContext";
import {
  PageTitle,
  Empty,
  Badge,
  Progress,
  Field,
  Message,
  Timeline,
  Modal,
} from "../components/UI";
import { Attachments } from "../components/ImageUpload";
import {
  ProposalEditor,
  UpdateEditor,
  MilestoneEditor,
  TestingEditor,
} from "../components/ProjectEditors";
import { Fact } from "./ChallengeDetail";
import { solutionService } from "../services/solutionService";
import { collaborationService } from "../services/collaborationService";
import {
  projectStatuses,
  type ProjectStatus,
  type ProjectUpdate,
  type Milestone,
} from "../types";
const tabs = [
  "Overview",
  "Team",
  "Solution Proposal",
  "Milestones",
  "Updates",
  "Documents",
  "Images",
  "Testing & Validation",
  "Collaboration",
  "Status History",
];
export default function ProjectDetail() {
  const { id } = useParams();
  const db = useDatabase();
  const { user } = useAuth();
  const p = db.projects.find((p) => p.id === id);
  const [tab, setTab] = useState("Overview");
  const [editor, setEditor] = useState("");
  const [update, setUpdate] = useState<ProjectUpdate>();
  const [milestone, setMilestone] = useState<Milestone>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stage, setStage] = useState<ProjectStatus>(p?.status || "Proposed");
  const [progress, setProgress] = useState(p?.progress || 0);
  const [support, setSupport] = useState("Funding");
  const [message, setMessage] = useState("");
  if (
    !p ||
    !user ||
    (user.role === "university" && p.universityId !== user.universityId)
  )
    return (
      <Empty text="Project not found or unavailable to this institution." />
    );
  const editable =
    user.role === "university" && p.universityId === user.universityId;
  const team = db.teams.find((t) => t.id === p.teamId);
  const institution = db.universities.find((u) => u.id === p.universityId);
  const allFiles = [
    ...(p.proposal?.attachments || []),
    ...p.updates.flatMap((u) => u.attachments),
    ...p.testing.attachments,
  ];
  const act = (fn: () => void, msg: string) => {
    setError("");
    try {
      fn();
      setSuccess(msg);
    } catch (e) {
      setError((e as Error).message);
    }
  };
  return (
    <>
      <PageTitle
        title={p.title}
        description={`${p.id} · ${institution?.name}`}
        action={
          editable ? (
            <button
              className="primary"
              onClick={() => {
                setUpdate(undefined);
                setEditor("update");
              }}
            >
              Add project update
            </button>
          ) : undefined
        }
      />
      <Message error={error} success={success} />
      <div className="project-banner">
        <div>
          <small>CURRENT STAGE</small>
          <Badge>{p.status}</Badge>
        </div>
        <div className="banner-progress">
          <small>PROJECT COMPLETION</small>
          <Progress value={p.progress} />
        </div>
        <div>
          <small>TARGET COMPLETION</small>
          <strong>{p.targetDate}</strong>
        </div>
        <div>
          <small>CHALLENGE</small>
          <Link to={`/${user.role}/challenges/${p.challengeId}`}>
            {p.challengeId} ↗
          </Link>
        </div>
      </div>
      <div className="tabs" aria-label="Project sections">
        {tabs.map((t) => (
          <button
            aria-pressed={t === tab}
            className={t === tab ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="detail-grid">
          <section className="panel">
            <h2>Project overview</h2>
            <p>{p.approach}</p>
            <dl className="facts">
              <Fact label="Department" value={p.department} />
              <Fact label="Faculty mentor" value={p.mentor} />
              <Fact label="Research group / lab" value={p.lab} />
              <Fact label="Start date" value={p.startDate} />
              <Fact label="Expected duration" value={`${p.duration} months`} />
              <Fact label="Team" value={team?.name || "Not assigned"} />
            </dl>
            <h3>Notes</h3>
            <p>{p.notes || "No additional notes."}</p>
            <h3>Latest update</h3>
            {p.updates.length ? (
              <>
                <strong>{p.updates.at(-1)?.title}</strong>
                <p>{p.updates.at(-1)?.description}</p>
              </>
            ) : (
              <p className="muted">No progress updates posted yet.</p>
            )}
          </section>
          <section className="panel">
            <h2>Solution status</h2>
            {editable ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  act(
                    () => solutionService.updateStatus(p.id, stage, progress),
                    "Project status saved.",
                  );
                }}
              >
                <Field label="Current stage">
                  <select
                    value={stage}
                    onChange={(e) => {
                      setStage(e.target.value as ProjectStatus);
                      if (e.target.value === "Completed") setProgress(100);
                    }}
                  >
                    {projectStatuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Completion percentage">
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={stage === "Completed" ? 100 : progress}
                    disabled={stage === "Completed"}
                    onChange={(e) => setProgress(Number(e.target.value))}
                  />
                </Field>
                <button className="primary full">Save status</button>
              </form>
            ) : (
              <>
                <Badge>{p.status}</Badge>
                <Progress value={p.progress} />
              </>
            )}
          </section>
        </div>
      )}
      {tab === "Team" && (
        <section className="panel">
          <div className="section-title">
            <h2>Project team</h2>
            {editable && (
              <Link className="secondary" to="/university/teams">
                Manage teams
              </Link>
            )}
          </div>
          {editable && (
            <Field label="Assigned team">
              <select
                value={p.teamId}
                onChange={(e) =>
                  act(
                    () => solutionService.setTeam(p.id, e.target.value),
                    "Project team changed.",
                  )
                }
              >
                <option value="" disabled>
                  Select team
                </option>
                {db.teams
                  .filter((t) => t.universityId === p.universityId)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </Field>
          )}
          {team ? (
            <>
              <h3>{team.name}</h3>
              <p>{team.description}</p>
              <p>
                Faculty mentor: {team.mentor} · Co-mentor:{" "}
                {team.coMentor || "None"}
              </p>
              <p>
                {team.departments} · {team.lab}
              </p>
              {team.members.map((m) => (
                <div className="list-row" key={m.id}>
                  <strong>{m.name}</strong>
                  <span>
                    {m.department} · {m.role}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <Empty text="No team assigned." />
          )}
        </section>
      )}
      {tab === "Solution Proposal" && (
        <section className="panel">
          <div className="section-title">
            <h2>Solution proposal</h2>
            {editable && (
              <button className="primary" onClick={() => setEditor("proposal")}>
                {p.proposal ? "Edit proposal" : "Submit proposal"}
              </button>
            )}
          </div>
          {p.proposal ? (
            <>
              <h3>{p.proposal.title}</h3>
              {(
                [
                  ["summary", "Executive summary"],
                  ["solution", "Proposed solution"],
                  ["approach", "Technical approach"],
                  ["impact", "Expected impact"],
                  ["resources", "Resources required"],
                  ["timeline", "Estimated timeline"],
                  ["collaboration", "Collaboration required"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <h3>{label}</h3>
                  <p className="prose">{p.proposal![key] || "Not specified"}</p>
                </div>
              ))}
              <h3>Funding required</h3>
              <p>₹{p.proposal.funding.toLocaleString("en-IN")}</p>
              <Attachments files={p.proposal.attachments} />
            </>
          ) : (
            <Empty text="No solution proposal submitted yet." />
          )}
        </section>
      )}
      {tab === "Milestones" && (
        <section className="panel">
          <div className="section-title">
            <h2>Milestones</h2>
            {editable && (
              <button
                className="primary"
                onClick={() => {
                  setMilestone(undefined);
                  setEditor("milestone");
                }}
              >
                Add milestone
              </button>
            )}
          </div>
          {p.milestones.map((m) => (
            <div className="milestone" key={m.id}>
              <div>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
                <small>Due {m.dueDate}</small>
              </div>
              <div>
                <Badge>{m.status}</Badge>
                <Progress value={m.progress} />
              </div>
              {editable && (
                <button
                  className="secondary"
                  onClick={() => {
                    setMilestone(m);
                    setEditor("milestone");
                  }}
                >
                  Edit milestone
                </button>
              )}
            </div>
          ))}
          {!p.milestones.length && (
            <Empty text="Add milestones to define the project’s delivery plan." />
          )}
        </section>
      )}
      {tab === "Updates" && (
        <section className="panel">
          <h2>Progress updates</h2>
          <p className="muted">Chronological order · earliest to latest</p>
          {p.updates.map((u) => (
            <article className="update" key={u.id}>
              <div className="section-title">
                <div>
                  <small>
                    {u.date} ·{" "}
                    {p.milestones.find((m) => m.id === u.milestone)?.title ||
                      "General update"}
                  </small>
                  <h3>{u.title}</h3>
                </div>
                {editable && (
                  <button
                    className="secondary"
                    onClick={() => {
                      setUpdate(u);
                      setEditor("update");
                    }}
                  >
                    Edit update
                  </button>
                )}
              </div>
              <Progress value={u.progress} />
              <p className="prose">{u.description}</p>
              {u.blockers && (
                <div className="notice warning">
                  <strong>Blockers</strong>
                  <p>{u.blockers}</p>
                </div>
              )}
              {u.nextSteps && (
                <p>
                  <strong>Next steps: </strong>
                  {u.nextSteps}
                </p>
              )}
              <Attachments files={u.attachments} />
            </article>
          ))}
          {!p.updates.length && <Empty text="No project updates yet." />}
        </section>
      )}
      {(tab === "Documents" || tab === "Images") && (
        <section className="panel">
          <h2>{tab}</h2>
          <p className="muted">
            Attachments from proposals, progress updates and testing results.
          </p>
          <Attachments
            files={allFiles.filter((f) =>
              tab === "Images"
                ? f.type.startsWith("image/")
                : !f.type.startsWith("image/"),
            )}
          />
        </section>
      )}
      {tab === "Testing & Validation" && (
        <section className="panel">
          <div className="section-title">
            <h2>Testing & validation</h2>
            {editable && (
              <button className="primary" onClick={() => setEditor("testing")}>
                Record results
              </button>
            )}
          </div>
          <Badge>{p.testing.result}</Badge>
          <p className="prose">
            {p.testing.description || "No test findings recorded yet."}
          </p>
          <Attachments files={p.testing.attachments} />
        </section>
      )}
      {tab === "Collaboration" && (
        <section className="panel">
          <div className="section-title">
            <h2>Collaboration</h2>
            {user.role === "industry" &&
              p.collaborationRequired.length > 0 &&
              !["Completed", "Cancelled"].includes(p.status) && (
                <button
                  className="primary"
                  onClick={() => setEditor("interest")}
                >
                  Express interest
                </button>
              )}
          </div>
          <p>
            <strong>Support sought: </strong>
            {p.collaborationRequired.join(", ") ||
              "No external support requested."}
          </p>
          {db.collaborations
            .filter((c) => c.projectId === p.id)
            .map((c) => (
              <div className="list-row" key={c.id}>
                <div>
                  <strong>{c.organisation}</strong>
                  <p>{c.message || "Interested in discussing support."}</p>
                  <small>{c.date}</small>
                </div>
                <Badge>{c.support}</Badge>
              </div>
            ))}
          {!db.collaborations.some((c) => c.projectId === p.id) && (
            <Empty text="No collaboration interests recorded yet." />
          )}
        </section>
      )}
      {tab === "Status History" && (
        <section className="panel">
          <h2>Status history</h2>
          <Timeline history={p.history} />
        </section>
      )}
      {editor === "proposal" && editable && (
        <ProposalEditor project={p} onClose={() => setEditor("")} />
      )}
      {editor === "update" && editable && (
        <UpdateEditor
          project={p}
          update={update}
          onClose={() => {
            setEditor("");
            setProgress(solutionService.getProjectById(p.id)?.progress || 0);
          }}
        />
      )}
      {editor === "milestone" && editable && (
        <MilestoneEditor
          project={p}
          milestone={milestone}
          onClose={() => setEditor("")}
        />
      )}
      {editor === "testing" && editable && (
        <TestingEditor project={p} onClose={() => setEditor("")} />
      )}
      {editor === "interest" && (
        <Modal
          title="Express collaboration interest"
          onClose={() => setEditor("")}
        >
          <Message error={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              act(() => {
                collaborationService.expressInterest(p.id, support, message);
                setEditor("");
              }, "Your interest has been recorded and the university notified.");
            }}
          >
            <Field label="Type of support">
              <select
                value={support}
                onChange={(e) => setSupport(e.target.value)}
              >
                {[
                  "Funding",
                  "Mentorship",
                  "Technical Expertise",
                  "Equipment",
                  "Manufacturing",
                  "Testing",
                  "Deployment",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="How can your organisation help? *">
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Field>
            <div className="actions">
              <button
                className="secondary"
                type="button"
                onClick={() => setEditor("")}
              >
                Cancel
              </button>
              <button className="primary">Submit interest</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
