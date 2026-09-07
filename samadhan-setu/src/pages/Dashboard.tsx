import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, ClipboardCheck } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDatabase } from "../hooks/useDatabase";
import { useAuth } from "../context/AuthContext";
import { PageTitle, Badge, Empty, Progress } from "../components/UI";
import { ChallengeTable } from "../components/ChallengeTable";
export default function Dashboard() {
  const db = useDatabase();
  const { user } = useAuth();
  if (!user) return null;
  const root = `/${user.role}`;
  const uni = user.universityId;
  const matches = db.matches.filter(
    (m) => m.universityId === uni && !m.declined,
  );
  const projects = db.projects.filter((p) =>
    user.role === "university" ? p.universityId === uni : true,
  );
  const active = projects.filter(
    (p) => !["Completed", "Cancelled"].includes(p.status),
  );
  const mine = db.challenges.filter((c) => c.citizenId === user.id);
  const queue = db.challenges.filter(
    (c) => c.reviewStatus === "Pending Review",
  );
  if (user.role === "citizen")
    return (
      <>
        <PageTitle
          title="My Submitted Challenges"
          description="Follow your community’s challenges from submission to solution."
          action={
            <Link className="primary" to={`${root}/challenges/new`}>
              <Plus size={18} />
              Submit a challenge
            </Link>
          }
        />
        <div className="stats">
          <Stat label="Submitted challenges" value={mine.length} />
          <Stat
            label="Awaiting review"
            value={
              mine.filter((c) => c.reviewStatus === "Pending Review").length
            }
          />
          <Stat
            label="Taken up by institutions"
            value={mine.filter((c) => c.universityId).length}
          />
          <Stat
            label="Completed"
            value={mine.filter((c) => c.status === "Completed").length}
          />
        </div>
        <section className="panel">
          <ChallengeTable challenges={mine} root={root} projects={projects} />
        </section>
      </>
    );
  if (user.role === "industry")
    return (
      <>
        <PageTitle
          title="Industry Collaboration"
          description="Support practical solutions through funding, expertise and deployment."
          action={
            <Link className="primary" to={`${root}/projects`}>
              Browse opportunities <ArrowUpRight size={17} />
            </Link>
          }
        />
        <div className="stats">
          <Stat
            label="Open opportunities"
            value={active.filter((p) => p.collaborationRequired.length).length}
          />
          <Stat
            label="Your expressions of interest"
            value={
              db.collaborations.filter((c) => c.industryId === user.id).length
            }
          />
          <Stat
            label="Participating universities"
            value={db.universities.length}
          />
        </div>
        <section className="panel">
          <h2>Your collaboration interests</h2>
          {db.collaborations
            .filter((c) => c.industryId === user.id)
            .map((c) => (
              <div className="list-row" key={c.id}>
                <div>
                  <Link
                    className="record-title"
                    to={`${root}/projects/${c.projectId}`}
                  >
                    {db.projects.find((p) => p.id === c.projectId)?.title}
                  </Link>
                  <p>{c.message}</p>
                </div>
                <Badge>{c.support}</Badge>
                <small>{c.date}</small>
              </div>
            ))}
          {!db.collaborations.some((c) => c.industryId === user.id) && (
            <Empty text="No expressions of interest yet. Browse projects to offer support." />
          )}
        </section>
      </>
    );
  const isGov = user.role === "government";
  const available = db.challenges.filter(
    (c) => matches.some((m) => m.challengeId === c.id) && !c.universityId,
  );
  return (
    <>
      <PageTitle
        title={isGov ? "State Innovation Overview" : "University Overview"}
        description={
          isGov
            ? "Monitor societal challenges, institutional participation and solution delivery."
            : "Connect your institution’s expertise to the challenges that need it."
        }
        action={
          <Link
            className="secondary"
            to={`${root}/${isGov ? "challenges" : "matches"}`}
          >
            {isGov ? "Review challenges" : "Explore matched challenges"}{" "}
            <ArrowUpRight size={17} />
          </Link>
        }
      />
      <div className="stats">
        {isGov ? (
          <>
            <Stat label="Total challenges" value={db.challenges.length} />
            <Stat
              label="Validated / matched"
              value={
                db.challenges.filter((c) =>
                  ["Validated", "Matched", "Assigned"].includes(c.reviewStatus),
                ).length
              }
            />
            <Stat
              label="Assigned challenges"
              value={db.challenges.filter((c) => c.universityId).length}
            />
            <Stat label="Active projects" value={active.length} />
            <Stat
              label="Completed projects"
              value={projects.filter((p) => p.status === "Completed").length}
            />
            <Stat label="Universities" value={db.universities.length} />
            <Stat
              label="Industry collaborations"
              value={db.collaborations.length}
            />
          </>
        ) : (
          <>
            <Stat label="Matched challenges" value={available.length} />
            <Stat
              label="Strong matches · 75%+"
              value={
                available.filter(
                  (c) =>
                    matches.find((m) => m.challengeId === c.id)!.matchScore >=
                    75,
                ).length
              }
            />
            <Stat label="Active solutions" value={active.length} />
            <Stat
              label="Project teams"
              value={db.teams.filter((t) => t.universityId === uni).length}
            />
            <Stat
              label="Completed solutions"
              value={projects.filter((p) => p.status === "Completed").length}
            />
          </>
        )}
      </div>
      {!isGov && available.length > 0 && (
        <div className="highlight-strip">
          <ClipboardCheck />
          <div>
            <strong>Your expertise can make a local difference.</strong>
            <p>
              {
                available.filter(
                  (c) =>
                    matches.find((m) => m.challengeId === c.id)!.matchScore >=
                    75,
                ).length
              }{" "}
              challenges are strong matches for your institution. Review their
              needs and decide where to contribute.
            </p>
          </div>
          <Link to={`${root}/matches`}>Review matches →</Link>
        </div>
      )}
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-title">
            <h2>
              {isGov
                ? "Challenge review queue"
                : "Recommended for your institution"}
            </h2>
            <Link to={`${root}/${isGov ? "challenges" : "matches"}`}>
              View all →
            </Link>
          </div>
          <ChallengeTable
            challenges={(isGov
              ? queue
              : available.sort(
                  (a, b) =>
                    matches.find((m) => m.challengeId === b.id)!.matchScore -
                    matches.find((m) => m.challengeId === a.id)!.matchScore,
                )
            ).slice(0, 4)}
            root={root}
            matches={isGov ? [] : matches}
          />
        </section>
        <section className="panel">
          <h2>Active solution progress</h2>
          {active.slice(0, 4).map((p) => (
            <div className="project-summary" key={p.id}>
              <small>{p.id}</small>
              <Link className="record-title" to={`${root}/projects/${p.id}`}>
                {p.title}
              </Link>
              <div className="row-between">
                <Badge>{p.status}</Badge>
                <span className="muted">Due {p.targetDate}</span>
              </div>
              <Progress value={p.progress} />
            </div>
          ))}
          {active.length === 0 && <Empty text="No active projects yet." />}
        </section>
      </div>
      {isGov && (
        <>
          <div className="two-col">
            <section className="panel">
              <h2>Challenges by domain</h2>
              <div
                className="chart"
                role="img"
                aria-label="Challenge counts by domain; exact counts are also listed below."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Array.from(
                      new Set(db.challenges.map((c) => c.category)),
                    ).map((name) => ({
                      name,
                      count: db.challenges.filter((c) => c.category === name)
                        .length,
                    }))}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                  >
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={115}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#23766c" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <details>
                <summary>View exact counts</summary>
                {Array.from(new Set(db.challenges.map((c) => c.category))).map(
                  (x) => (
                    <p key={x}>
                      {x}:{" "}
                      {db.challenges.filter((c) => c.category === x).length}
                    </p>
                  ),
                )}
              </details>
            </section>
            <section className="panel">
              <h2>Projects requiring attention</h2>
              {active
                .filter(
                  (p) =>
                    p.status === "On Hold" ||
                    p.targetDate < new Date().toISOString().slice(0, 10) ||
                    p.updates.some((u) => u.blockers.trim()),
                )
                .map((p) => (
                  <div className="list-row" key={p.id}>
                    <Link to={`${root}/projects/${p.id}`}>{p.title}</Link>
                    <Badge>{p.status}</Badge>
                  </div>
                ))}
              {!active.some(
                (p) =>
                  p.status === "On Hold" ||
                  p.targetDate < new Date().toISOString().slice(0, 10) ||
                  p.updates.some((u) => u.blockers.trim()),
              ) && <Empty text="No overdue projects or reported blockers." />}
              <h2>Highest impact projects</h2>
              {[...projects]
                .sort(
                  (a, b) =>
                    (db.challenges.find((c) => c.id === b.challengeId)
                      ?.population || 0) -
                    (db.challenges.find((c) => c.id === a.challengeId)
                      ?.population || 0),
                )
                .slice(0, 3)
                .map((p) => (
                  <div className="list-row" key={p.id}>
                    <Link to={`${root}/projects/${p.id}`}>{p.title}</Link>
                    <span>
                      {db.challenges
                        .find((c) => c.id === p.challengeId)
                        ?.population.toLocaleString()}{" "}
                      people
                    </span>
                  </div>
                ))}
            </section>
          </div>
          <section className="panel">
            <h2>Recently completed projects</h2>
            {projects
              .filter((p) => p.status === "Completed")
              .map((p) => (
                <div className="list-row" key={p.id}>
                  <Link to={`${root}/projects/${p.id}`}>{p.title}</Link>
                  <Badge>Completed</Badge>
                </div>
              ))}
          </section>
        </>
      )}
    </>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value.toString().padStart(2, "0")}</strong>
    </div>
  );
}
