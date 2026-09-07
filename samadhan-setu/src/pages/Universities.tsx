import { Link } from "react-router-dom";
import { useDatabase } from "../hooks/useDatabase";
import { PageTitle } from "../components/UI";
export default function Universities() {
  const db = useDatabase();
  return (
    <>
      <PageTitle
        title="Participating Universities"
        description="Institutional expertise, facilities and ongoing participation."
      />
      {db.universities.map((u) => (
        <section key={u.id} className="panel">
          <h2>{u.name}</h2>
          <p className="muted">
            {u.type} · {u.district}
          </p>
          <p>{u.description}</p>
          <details>
            <summary>View expertise and facilities</summary>
            {Object.entries(u)
              .filter(
                ([key]) =>
                  !["id", "name", "district", "type", "description"].includes(
                    key,
                  ),
              )
              .map(([key, value]) => (
                <p key={key}>
                  <strong>{key.replace(/([A-Z])/g, " $1")}: </strong>
                  {value || "Not specified"}
                </p>
              ))}
          </details>
          <h3>
            Projects ·{" "}
            {db.projects.filter((p) => p.universityId === u.id).length}
          </h3>
          {db.projects
            .filter((p) => p.universityId === u.id)
            .map((p) => (
              <div className="list-row" key={p.id}>
                <Link to={`/government/projects/${p.id}`}>{p.title}</Link>
                <span>
                  {p.status} · {p.progress}%
                </span>
              </div>
            ))}
        </section>
      ))}
    </>
  );
}
