import type {
  Project,
  ProjectStatus,
  ProjectUpdate,
  Milestone,
  SolutionProposal,
} from "../types";
import { projectStatuses } from "../types";
import { mutate, readDB, today, uid } from "./storage";
import { requireRole } from "./authService";
import { addNotification } from "./notificationService";
function ownProject(project: Project | undefined) {
  const user = requireRole("university");
  if (!project || project.universityId !== user.universityId)
    throw Error("Project not found for this institution.");
  return project;
}
function validProgress(progress: number) {
  if (!Number.isFinite(progress) || progress < 0 || progress > 100)
    throw Error("Progress must be between 0 and 100.");
}
export type UptakeData = Pick<
  Project,
  | "title"
  | "department"
  | "mentor"
  | "teamId"
  | "duration"
  | "approach"
  | "lab"
  | "notes"
>;
export const solutionService = {
  getProjects: () => readDB().projects,
  getProjectById: (id: string) => readDB().projects.find((p) => p.id === id),
  takeUpChallenge: (
    challengeId: string,
    universityId: string,
    data: UptakeData,
  ) => {
    const user = requireRole("university");
    if (user.universityId !== universityId)
      throw Error("Institution mismatch.");
    if (
      !data.title.trim() ||
      !data.department.trim() ||
      !data.mentor.trim() ||
      data.approach.trim().length < 20 ||
      data.duration < 1
    )
      throw Error("Complete all required project fields.");
    return mutate((db) => {
      const c = db.challenges.find((c) => c.id === challengeId);
      const match = db.matches.find(
        (m) => m.challengeId === challengeId && m.universityId === universityId,
      );
      if (
        !c ||
        c.universityId ||
        !["Matched", "Validated"].includes(c.reviewStatus) ||
        !match ||
        match.declined
      )
        throw Error("This challenge is not available for uptake.");
      if (
        !db.teams.some(
          (t) => t.id === data.teamId && t.universityId === universityId,
        )
      )
        throw Error("Select a team belonging to your institution.");
      const target = new Date();
      target.setMonth(target.getMonth() + data.duration);
      const p: Project = {
        ...data,
        id: uid("PRJ-2026"),
        challengeId,
        universityId,
        status: "Proposed",
        progress: 0,
        startDate: today(),
        targetDate: target.toISOString().slice(0, 10),
        milestones: [],
        updates: [],
        history: [{ date: today(), label: "Proposed" }],
        testing: {
          description: "",
          result: "Not yet recorded",
          attachments: [],
        },
        collaborationRequired: ["Mentorship"],
      };
      db.projects.unshift(p);
      c.universityId = universityId;
      c.reviewStatus = "Assigned";
      c.status = "Taken Up by University";
      c.history.push({ date: today(), label: "Project Initiated" });
      [c.citizenId, "GOV001"].forEach((recipientId) =>
        addNotification(db, {
          recipientId,
          category: "Challenge Accepted",
          message: `${c.title} has been taken up by ${db.universities.find((u) => u.id === universityId)?.name}.`,
          path:
            recipientId === "GOV001"
              ? `/government/projects/${p.id}`
              : `/citizen/challenges/${c.id}`,
        }),
      );
      return p;
    });
  },
  updateStatus: (id: string, status: ProjectStatus, progress: number) => {
    validProgress(progress);
    if (!projectStatuses.includes(status))
      throw Error("Invalid project stage.");
    return mutate((db) => {
      const p = ownProject(db.projects.find((p) => p.id === id));
      p.progress = status === "Completed" ? 100 : progress;
      if (p.status !== status) {
        p.status = status;
        p.history.push({ date: today(), label: status });
      }
      const c = db.challenges.find((c) => c.id === p.challengeId)!;
      c.status =
        status === "Completed"
          ? "Completed"
          : status === "Testing"
            ? "Testing"
            : status === "On Hold" || status === "Cancelled"
              ? status
              : "Solution Development";
      c.history.push({ date: today(), label: c.status });
      [c.citizenId, "GOV001"].forEach((recipientId) =>
        addNotification(db, {
          recipientId,
          category:
            status === "Completed" ? "Project Completed" : "Project Update",
          message: `${p.title}: ${status} (${p.progress}%).`,
          path:
            recipientId === "GOV001"
              ? `/government/projects/${p.id}`
              : `/citizen/challenges/${c.id}`,
        }),
      );
    });
  },
  saveProposal: (id: string, proposal: SolutionProposal) =>
    mutate((db) => {
      const p = ownProject(db.projects.find((p) => p.id === id));
      if (
        !proposal.title.trim() ||
        proposal.summary.length < 20 ||
        !proposal.solution.trim() ||
        proposal.funding < 0
      )
        throw Error(
          "Complete the proposal title, summary, proposed solution and valid funding amount.",
        );
      p.proposal = proposal;
      p.collaborationRequired = proposal.collaboration
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }),
  saveUpdate: (id: string, update: ProjectUpdate) => {
    validProgress(update.progress);
    return mutate((db) => {
      const p = ownProject(db.projects.find((p) => p.id === id));
      if (
        !update.title.trim() ||
        update.description.trim().length < 20 ||
        !update.date
      )
        throw Error(
          "Enter a title, date and description of at least 20 characters.",
        );
      if (p.status === "Completed" && update.progress !== 100)
        throw Error("Reopen the project before reducing progress.");
      const index = p.updates.findIndex((u) => u.id === update.id);
      if (index < 0) p.updates.push(update);
      else p.updates[index] = update;
      p.updates.sort((a, b) => a.date.localeCompare(b.date));
      p.progress = p.updates.at(-1)?.progress ?? p.progress;
      const c = db.challenges.find((c) => c.id === p.challengeId)!;
      addNotification(db, {
        recipientId: "GOV001",
        category: "Project Update",
        message: `${p.title}: ${update.title}`,
        path: `/government/projects/${p.id}`,
      });
      addNotification(db, {
        recipientId: c.citizenId,
        category: "Project Update",
        message: `${p.title}: ${update.title}`,
        path: `/citizen/challenges/${c.id}`,
      });
    });
  },
  saveMilestone: (id: string, m: Milestone) => {
    validProgress(m.progress);
    return mutate((db) => {
      const p = ownProject(db.projects.find((p) => p.id === id));
      if (!m.title.trim() || !m.dueDate)
        throw Error("Milestone title and due date are required.");
      m.progress =
        m.status === "Completed"
          ? 100
          : m.status === "Not Started"
            ? 0
            : m.progress;
      const index = p.milestones.findIndex((x) => x.id === m.id);
      if (index < 0) p.milestones.push(m);
      else p.milestones[index] = m;
    });
  },
  saveTesting: (id: string, testing: Project["testing"]) =>
    mutate((db) => {
      const p = ownProject(db.projects.find((p) => p.id === id));
      p.testing = testing;
      addNotification(db, {
        recipientId: "GOV001",
        category: "Validation Result",
        message: `Testing results updated: ${p.title}`,
        path: `/government/projects/${p.id}`,
      });
    }),
  setTeam: (id: string, teamId: string) =>
    mutate((db) => {
      const p = ownProject(db.projects.find((p) => p.id === id));
      if (
        !db.teams.some(
          (t) => t.id === teamId && t.universityId === p.universityId,
        )
      )
        throw Error("Team not found.");
      p.teamId = teamId;
    }),
};
