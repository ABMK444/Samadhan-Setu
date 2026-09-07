import { useState } from "react";
import { useDatabase } from "../hooks/useDatabase";
import { useAuth } from "../context/AuthContext";
import { PageTitle, Field } from "../components/UI";
import { ChallengeTable } from "../components/ChallengeTable";
export default function Challenges() {
  const db = useDatabase();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [district, setDistrict] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState("0");
  const [institution, setInstitution] = useState("");
  const [sort, setSort] = useState("score");
  const [declined, setDeclined] = useState(false);
  if (!user) return null;
  const uni = user.role === "university";
  const matches = db.matches.filter(
    (m) => m.universityId === user.universityId,
  );
  const base = db.challenges.filter((c) =>
    uni
      ? matches.some((m) => m.challengeId === c.id && (!m.declined || declined))
      : true,
  );
  const filtered = base
    .filter(
      (c) =>
        `${c.id} ${c.title} ${c.description}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (!domain || c.category === domain) &&
        (!district || c.district === district) &&
        (!priority || c.priority === priority) &&
        (!status || c.reviewStatus === status) &&
        (!institution || c.universityId === institution) &&
        (!uni ||
          (matches.find((m) => m.challengeId === c.id)?.matchScore || 0) >=
            Number(score)),
    )
    .sort((a, b) =>
      sort === "score" && uni
        ? (matches.find((m) => m.challengeId === b.id)?.matchScore || 0) -
          (matches.find((m) => m.challengeId === a.id)?.matchScore || 0)
        : b.date.localeCompare(a.date),
    );
  return (
    <>
      <PageTitle
        title={uni ? "Matched Challenges" : "Challenge Review"}
        description={
          uni
            ? "Review relevance, understand community needs and choose a challenge to take forward."
            : "Review submissions, request information and connect validated needs with institutions."
        }
      />
      <section className="panel">
        <div className="filters">
          <Field label="Search challenges">
            <input
              type="search"
              placeholder="Title or challenge ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
          <Filter
            label="Domain"
            value={domain}
            set={setDomain}
            options={[...new Set(base.map((c) => c.category))]}
          />
          <Filter
            label="District"
            value={district}
            set={setDistrict}
            options={[...new Set(base.map((c) => c.district))]}
          />
          <Filter
            label="Priority"
            value={priority}
            set={setPriority}
            options={["High", "Medium", "Low"]}
          />
          <Filter
            label="Review status"
            value={status}
            set={setStatus}
            options={[
              "Pending Review",
              "Validated",
              "Needs More Information",
              "Rejected",
              "Matched",
              "Assigned",
            ]}
          />
          {uni ? (
            <Field label="Minimum match">
              <select value={score} onChange={(e) => setScore(e.target.value)}>
                <option value="0">All scores</option>
                <option value="75">75% and above</option>
                <option value="90">90% and above</option>
              </select>
            </Field>
          ) : (
            <Field label="Assigned university">
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              >
                <option value="">All universities</option>
                {db.universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Sort by">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {uni && <option value="score">Highest match</option>}
              <option value="date">Newest first</option>
            </select>
          </Field>
        </div>
        <div className="row-between table-caption">
          <span>{filtered.length} challenges</span>
          {uni && (
            <label className="check">
              <input
                type="checkbox"
                checked={declined}
                onChange={(e) => setDeclined(e.target.checked)}
              />
              Include declined
            </label>
          )}
          <button
            className="text-button"
            onClick={() => {
              setSearch("");
              setDomain("");
              setDistrict("");
              setPriority("");
              setStatus("");
              setScore("0");
              setInstitution("");
              setDeclined(false);
            }}
          >
            Clear filters
          </button>
        </div>
        <ChallengeTable
          challenges={filtered}
          root={`/${user.role}`}
          matches={uni ? matches : []}
        />
      </section>
    </>
  );
}
export function Filter({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(e) => set(e.target.value)}>
        <option value="">All</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </Field>
  );
}
