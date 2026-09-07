import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { universityService } from "../services/universityService";
import { PageTitle, Field, Message, Empty } from "../components/UI";
export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() =>
    universityService.getProfile(user?.universityId || ""),
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  if (!profile) return <Empty text="University profile not found." />;
  // This profile will eventually feed the backend matching model; the UI does
  // not calculate a score from these fields.
  const fields = [
    ["name", "University name"],
    ["type", "University type"],
    ["district", "District"],
    ["website", "Website"],
    ["description", "Institution description"],
    ["departments", "Academic departments"],
    ["researchAreas", "Research areas"],
    ["facultyExpertise", "Faculty expertise"],
    ["researchCentres", "Research centres"],
    ["innovationCentres", "Innovation centres"],
    ["incubationFacilities", "Incubation facilities"],
    ["laboratories", "Laboratories"],
    ["facilities", "Major equipment / facilities"],
    ["previousProjects", "Previous innovation projects"],
  ] as const;
  return (
    <>
      <PageTitle
        title="University Profile"
        description="Maintain the expertise and facilities that help identify relevant challenges."
      />
      <Message error={error} success={success} />
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            universityService.updateProfile(profile.id, profile);
            setSuccess("University profile saved.");
            setError("");
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <div className="form-grid">
          {fields.map(([key, label], i) => (
            <Field
              key={key}
              label={label + (key === "name" ? " *" : "")}
              wide={i >= 4}
            >
              {i < 4 ? (
                <input
                  required={key === "name"}
                  type={key === "website" ? "url" : "text"}
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile({ ...profile, [key]: e.target.value })
                  }
                />
              ) : (
                <textarea
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile({ ...profile, [key]: e.target.value })
                  }
                />
              )}
            </Field>
          ))}
        </div>
        <div className="actions">
          <button className="primary">Save profile</button>
        </div>
      </form>
    </>
  );
}
