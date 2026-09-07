import { useState } from "react";
import { Link } from "react-router-dom";
import { useDatabase } from "../hooks/useDatabase";
import { useAuth } from "../context/AuthContext";
import { PageTitle, Badge, Progress, Field, Empty } from "../components/UI";
import { Filter } from "./Challenges";
import { projectStatuses } from "../types";
export default function Projects({
  completed = false,
}: {
  completed?: boolean;
}) {
  const db = useDatabase();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [progress, setProgress] = useState("0");
  const [date, setDate] = useState("");
  if (!user) return null;
  const industry = user.role === "industry";
  const base = db.projects.filter((p) =>
    user.role === "university"
      ? p.universityId === user.universityId &&
        (completed ? p.status === "Completed" : p.status !== "Completed")
      : industry
        ? p.collaborationRequired.length > 0 &&
          !["Completed", "Cancelled"].includes(p.status)
        : true,
  );
  const list = base.filter(
    (p) =>
      `${p.title} ${p.id}`.toLowerCase().includes(search.toLowerCase()) &&
      (!status || p.status === status) &&
      (!department || p.department === department) &&
      p.progress >= Number(progress) &&
      (!date || p.startDate >= date),
  );
  return (
    <>
      <PageTitle
        title={
          completed
            ? "Completed Projects"
            : industry
              ? "Collaboration Projects"
              : user.role === "government"
                ? "All Solution Projects"
                : "Active Solutions"
        }
        description={
          industry
            ? "Offer expertise and resources to projects seeking partners."
            : "Track proposals, development milestones and measurable outcomes."
        }
      />
      <section className="panel">
        <div className="filters">
          <Field label="Search projects">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Title or project ID"
            />
          </Field>
          <Filter
            label="Stage"
            value={status}
            set={setStatus}
            options={[...projectStatuses]}
          />
          <Filter
            label="Department"
            value={department}
            set={setDepartment}
            options={[...new Set(base.map((p) => p.department))]}
          />
          <Field label="Minimum completion">
            <select
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            >
              <option value="0">All</option>
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
            </select>
          </Field>
          <Field label="Started on or after">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
        <div className="row-between table-caption">
          <span>{list.length} projects</span>
          <button
            className="text-button"
            onClick={() => {
              setSearch("");
              setStatus("");
              setDepartment("");
              setProgress("0");
              setDate("");
            }}
          >
            Clear filters
          </button>
        </div>
        {list.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Institution / Department</th>
                  <th>Stage</th>
                  <th>Completion</th>
                  <th>{industry ? "Support sought" : "Target date"}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <small>
                        {p.id} · {p.challengeId}
                      </small>
                      <Link
                        className="record-title"
                        to={`/${user.role}/projects/${p.id}`}
                      >
                        {p.title}
                      </Link>
                      <small>Started {p.startDate}</small>
                    </td>
                    <td>
                      {
                        db.universities.find((u) => u.id === p.universityId)
                          ?.name
                      }
                      <small>{p.department}</small>
                    </td>
                    <td>
                      <Badge>{p.status}</Badge>
                    </td>
                    <td>
                      <Progress value={p.progress} />
                    </td>
                    <td>
                      {industry
                        ? p.collaborationRequired.join(", ")
                        : p.targetDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text="No projects match these filters." />
        )}
      </section>
    </>
  );
}
