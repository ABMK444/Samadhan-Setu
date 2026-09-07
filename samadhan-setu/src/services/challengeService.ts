import type { Challenge, ReviewStatus } from "../types";
import { mutate, readDB, today, uid } from "./storage";
import { requireRole } from "./authService";
import { createMockMatches } from "./universityService";
import { addNotification } from "./notificationService";
export const challengeService = {
  getChallenges: () => readDB().challenges,
  getChallengeById: (id: string) =>
    readDB().challenges.find((c) => c.id === id),
  createChallenge: (
    data: Omit<
      Challenge,
      | "id"
      | "citizenId"
      | "submittedBy"
      | "date"
      | "reviewStatus"
      | "reviewNote"
      | "status"
      | "history"
    >,
  ) => {
    const user = requireRole("citizen");
    if (
      data.title.trim().length < 5 ||
      data.description.trim().length < 30 ||
      !data.district ||
      data.population < 1
    )
      throw Error(
        "Enter a title, description of at least 30 characters, district and affected population.",
      );
    return mutate((db) => {
      const c: Challenge = {
        ...data,
        id: uid("JSI-2026"),
        citizenId: user.id,
        submittedBy: user.name,
        date: today(),
        reviewStatus: "Pending Review",
        reviewNote: "",
        status: "Submitted",
        history: [{ date: today(), label: "Submitted" }],
      };
      db.challenges.unshift(c);
      addNotification(db, {
        recipientId: "GOV001",
        category: "Government Review",
        message: `New challenge: ${c.title}`,
        path: `/government/challenges/${c.id}`,
      });
      return c;
    });
  },
  review: (id: string, status: ReviewStatus, note: string) => {
    requireRole("government");
    return mutate((db) => {
      const c = db.challenges.find((c) => c.id === id);
      if (!c) throw Error("Challenge not found.");
      if (c.universityId)
        throw Error("Assigned challenges cannot be re-reviewed.");
      if (
        (status === "Rejected" || status === "Needs More Information") &&
        !note.trim()
      )
        throw Error("Provide a reason or information request.");
      c.reviewStatus = status;
      c.reviewNote = note;
      c.status = status;
      c.history.push({ date: today(), label: status });
      if (status === "Validated") {
        createMockMatches(db, id);
        c.reviewStatus = "Matched";
        c.status = "Awaiting University Response";
        c.history.push({ date: today(), label: "University Matching" });
      } else {
        db.matches = db.matches.filter((m) => m.challengeId !== id);
      }
      addNotification(db, {
        recipientId: c.citizenId,
        category: "Government Review",
        message: `${c.title}: ${status}. ${note}`,
        path: `/citizen/challenges/${id}`,
      });
    });
  },
};
