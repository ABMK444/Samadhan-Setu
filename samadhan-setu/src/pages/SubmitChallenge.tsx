import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, districts } from "../data/seed";
import { challengeService } from "../services/challengeService";
import { classificationService } from "../services/classificationService";
import { PageTitle, Field, Message } from "../components/UI";
import { ImageUpload } from "../components/ImageUpload";
import type { ChallengeAttachment } from "../types";
export default function SubmitChallenge() {
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [files, setFiles] = useState<ChallengeAttachment[]>([]);
  return (
    <>
      <PageTitle
        title="Submit a Societal Challenge"
        description="Describe the local need, who it affects and the outcome your community hopes to see."
      />
      <Message error={error} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const get = (key: string) => String(f.get(key) || "").trim();
          try {
            const c = challengeService.createChallenge({
              title: get("title"),
              description: get("description"),
              category: classificationService.classifyChallenge(
                get("description"),
                get("category"),
              ),
              district: get("district"),
              block: get("block"),
              village: get("village"),
              location: get("location"),
              population: Number(get("population")),
              duration: get("duration"),
              attempts: get("attempts"),
              outcome: get("outcome"),
              priority: get("priority"),
              contact: get("contact"),
              attachments: files,
            });
            nav(`/citizen/challenges/${c.id}`);
          } catch (err) {
            setError((err as Error).message);
            window.scrollTo(0, 0);
          }
        }}
      >
        <section className="panel">
          <h2>01 · Describe the problem</h2>
          <div className="form-grid">
            <Field label="Challenge title *" wide>
              <input
                required
                minLength={5}
                name="title"
                placeholder="Give your challenge a clear, specific title"
              />
            </Field>
            <Field label="Problem description * (at least 30 characters)" wide>
              <textarea required minLength={30} name="description" rows={5} />
            </Field>
            <Field label="Category *">
              <select required name="category">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Urgency *">
              <select name="priority">
                <option>Medium</option>
                <option>High</option>
                <option>Low</option>
              </select>
            </Field>
            <Field label="How long has the problem existed?">
              <input
                name="duration"
                placeholder="e.g. Since the last monsoon"
              />
            </Field>
            <Field label="Approximate people affected *">
              <input
                required
                type="number"
                min="1"
                max="100000000"
                name="population"
              />
            </Field>
            <Field label="Current attempts to solve it" wide>
              <textarea name="attempts" />
            </Field>
            <Field label="Expected outcome *" wide>
              <textarea required name="outcome" />
            </Field>
          </div>
        </section>
        <section className="panel">
          <h2>02 · Location & contact</h2>
          <div className="form-grid">
            <Field label="District *">
              <select required name="district">
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
            <Field label="Block *">
              <input required name="block" />
            </Field>
            <Field label="Village / Ward *">
              <input required name="village" />
            </Field>
            <Field label="Contact email *">
              <input required type="email" name="contact" />
            </Field>
            <Field label="Location description" wide>
              <textarea
                name="location"
                placeholder="Nearby landmarks or directions"
              />
            </Field>
          </div>
        </section>
        <section className="panel">
          <h2>03 · Supporting evidence</h2>
          <p className="muted">
            Add photographs and supporting documents. Avoid personal or
            sensitive information in this demo.
          </p>
          <ImageUpload documents value={files} onChange={setFiles} />
          <p className="muted">
            Video upload is reserved for a future release.
          </p>
        </section>
        <div className="actions">
          <button className="primary">Submit challenge for review</button>
        </div>
      </form>
    </>
  );
}
