import { useState } from "react";
import type {
  Project,
  ProjectUpdate,
  Milestone,
  SolutionProposal,
} from "../types";
import { solutionService } from "../services/solutionService";
import { uid, today } from "../services/storage";
import { Field, Message, Modal } from "./UI";
import { ImageUpload } from "./ImageUpload";
// Editors keep unsaved form state local. Only service calls commit records.
export function ProposalEditor({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [data, setData] = useState<SolutionProposal>(
    project.proposal || {
      title: "",
      summary: "",
      solution: "",
      approach: "",
      impact: "",
      resources: "",
      timeline: "",
      collaboration: "",
      funding: 0,
      attachments: [],
    },
  );
  const [error, setError] = useState("");
  const fields = [
    ["title", "Proposal title *"],
    ["summary", "Executive summary * (at least 20 characters)"],
    ["solution", "Proposed solution *"],
    ["approach", "Technical approach"],
    ["impact", "Expected impact"],
    ["resources", "Resources required"],
    ["timeline", "Estimated timeline"],
    ["collaboration", "Collaboration required (comma-separated)"],
  ] as const;
  return (
    <Modal title="Solution proposal" onClose={onClose}>
      <Message error={error} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            solutionService.saveProposal(project.id, data);
            onClose();
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <div className="form-grid">
          {fields.map(([key, label]) => (
            <Field wide key={key} label={label}>
              {key === "title" ? (
                <input
                  required
                  value={data[key]}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                />
              ) : (
                <textarea
                  required={key === "summary" || key === "solution"}
                  minLength={key === "summary" ? 20 : undefined}
                  value={data[key]}
                  onChange={(e) => setData({ ...data, [key]: e.target.value })}
                />
              )}
            </Field>
          ))}
          <Field label="Funding required (INR)">
            <input
              type="number"
              min="0"
              value={data.funding}
              onChange={(e) =>
                setData({ ...data, funding: Number(e.target.value) })
              }
            />
          </Field>
          <ImageUpload
            documents
            value={data.attachments}
            onChange={(attachments) => setData({ ...data, attachments })}
          />
        </div>
        <div className="actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Save proposal</button>
        </div>
      </form>
    </Modal>
  );
}
export function UpdateEditor({
  project,
  update,
  onClose,
}: {
  project: Project;
  update?: ProjectUpdate;
  onClose: () => void;
}) {
  const [data, setData] = useState<ProjectUpdate>(
    update || {
      id: uid("UPD"),
      title: "",
      date: today(),
      description: "",
      milestone: "",
      progress: project.progress,
      blockers: "",
      nextSteps: "",
      attachments: [],
    },
  );
  const [error, setError] = useState("");
  return (
    <Modal
      title={update ? "Edit project update" : "Add project update"}
      onClose={onClose}
    >
      <Message error={error} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            solutionService.saveUpdate(project.id, data);
            onClose();
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <div className="form-grid">
          <Field label="Update title *" wide>
            <input
              required
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </Field>
          <Field label="Date *">
            <input
              type="date"
              required
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
          </Field>
          <Field label="Progress percentage *">
            <input
              type="number"
              required
              min="0"
              max="100"
              value={data.progress}
              onChange={(e) =>
                setData({ ...data, progress: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Milestone" wide>
            <select
              value={data.milestone}
              onChange={(e) => setData({ ...data, milestone: e.target.value })}
            >
              <option value="">General project update</option>
              {project.milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </Field>
          {(
            [
              ["description", "Description * (at least 20 characters)"],
              ["blockers", "Problems / blockers"],
              ["nextSteps", "Next steps"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} wide label={label}>
              <textarea
                required={key === "description"}
                minLength={key === "description" ? 20 : undefined}
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
              />
            </Field>
          ))}
          <ImageUpload
            documents
            value={data.attachments}
            onChange={(attachments) => setData({ ...data, attachments })}
          />
        </div>
        <div className="actions">
          <button className="secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Save update</button>
        </div>
      </form>
    </Modal>
  );
}
export function MilestoneEditor({
  project,
  milestone,
  onClose,
}: {
  project: Project;
  milestone?: Milestone;
  onClose: () => void;
}) {
  const [data, setData] = useState<Milestone>(
    milestone || {
      id: uid("MS"),
      title: "",
      description: "",
      dueDate: project.targetDate,
      status: "Not Started",
      progress: 0,
    },
  );
  const [error, setError] = useState("");
  return (
    <Modal
      title={milestone ? "Edit milestone" : "Add milestone"}
      onClose={onClose}
    >
      <Message error={error} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            solutionService.saveMilestone(project.id, data);
            onClose();
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <div className="form-grid">
          <Field label="Title *" wide>
            <input
              required
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </Field>
          <Field label="Description" wide>
            <textarea
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </Field>
          <Field label="Due date *">
            <input
              type="date"
              required
              value={data.dueDate}
              onChange={(e) => setData({ ...data, dueDate: e.target.value })}
            />
          </Field>
          <Field label="Status">
            <select
              value={data.status}
              onChange={(e) =>
                setData({
                  ...data,
                  status: e.target.value as Milestone["status"],
                  progress:
                    e.target.value === "Completed"
                      ? 100
                      : e.target.value === "Not Started"
                        ? 0
                        : data.progress,
                })
              }
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </Field>
          <Field label="Completion percentage">
            <input
              type="number"
              min="0"
              max="100"
              disabled={data.status !== "In Progress"}
              value={data.progress}
              onChange={(e) =>
                setData({ ...data, progress: Number(e.target.value) })
              }
            />
          </Field>
        </div>
        <div className="actions">
          <button className="secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Save milestone</button>
        </div>
      </form>
    </Modal>
  );
}
export function TestingEditor({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [data, setData] = useState(project.testing);
  const [error, setError] = useState("");
  return (
    <Modal title="Testing & validation results" onClose={onClose}>
      <Message error={error} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            solutionService.saveTesting(project.id, data);
            onClose();
          } catch (err) {
            setError((err as Error).message);
          }
        }}
      >
        <Field label="Test method and findings *">
          <textarea
            required
            minLength={20}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </Field>
        <Field label="Result">
          <select
            value={data.result}
            onChange={(e) => setData({ ...data, result: e.target.value })}
          >
            <option>Not yet recorded</option>
            <option>In Progress</option>
            <option>Passed</option>
            <option>Failed</option>
            <option>Requires further testing</option>
          </select>
        </Field>
        <ImageUpload
          documents
          value={data.attachments}
          onChange={(attachments) => setData({ ...data, attachments })}
        />
        <div className="actions">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary">Save results</button>
        </div>
      </form>
    </Modal>
  );
}
