import { Link } from "react-router-dom";
import type { Challenge, UniversityMatch, Project } from "../types";
import { Badge, Empty, Progress } from "./UI";
export function ChallengeTable({
  challenges,
  root,
  matches = [],
  projects = [],
}: {
  challenges: Challenge[];
  root: string;
  matches?: UniversityMatch[];
  projects?: Project[];
}) {
  return challenges.length ? (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Challenge</th>
            <th>District / Domain</th>
            <th>Priority</th>
            <th>Status</th>
            {matches.length > 0 && <th>Relevance</th>}
            <th>
              <span className="sr-only">Open challenge</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((c) => {
            const m = matches.find((m) => m.challengeId === c.id);
            const p = projects.find((p) => p.challengeId === c.id);
            return (
              <tr key={c.id}>
                <td>
                  <small>
                    {c.id} · {c.date}
                  </small>
                  <Link
                    className="record-title"
                    to={`${root}/challenges/${c.id}`}
                  >
                    {c.title}
                  </Link>
                  <small>{c.submittedBy}</small>
                </td>
                <td>
                  {c.district}
                  <small>{c.category}</small>
                </td>
                <td>
                  <Badge>{c.priority}</Badge>
                </td>
                <td>
                  <Badge>{c.status}</Badge>
                  {p && <Progress value={p.progress} />}
                </td>
                {matches.length > 0 && (
                  <td>
                    {m ? (
                      <>
                        <strong className="match-score">{m.matchScore}%</strong>
                        <small>
                          {m.declined
                            ? "Declined"
                            : m.matchScore >= 75
                              ? "Strong Match"
                              : m.matchScore >= 60
                                ? "Good Match"
                                : "Moderate Match"}
                        </small>
                      </>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                )}
                <td>
                  <Link className="text-link" to={`${root}/challenges/${c.id}`}>
                    View →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty text="No challenges match these filters." />
  );
}
