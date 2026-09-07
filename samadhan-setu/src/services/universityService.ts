import type { Database, UniversityProfile } from "../types";
import { mutate, readDB } from "./storage";
import { requireRole } from "./authService";
import { notifyUniversityOfMatch } from "./notificationService";
// MATCHING ALGORITHM INTEGRATION POINT
// Future POST /api/challenges/{id}/match returns UniversityMatch[] with scores
// from 0–100 based on expertise, departments, facilities and prior projects.
// The following constants are demo fixtures, NOT an algorithm.
export function createMockMatches(db: Database, challengeId: string) {
  const c = db.challenges.find((c) => c.id === challengeId);
  if (!c) return;
  db.universities.forEach((u, i) => {
    let match = db.matches.find(
      (m) => m.challengeId === challengeId && m.universityId === u.id,
    );
    if (!match) {
      match = {
        universityId: u.id,
        challengeId,
        matchScore: i === 0 ? 91 : 68,
        matchingDomains: [c.category],
        matchingExpertise: ["Demonstration matching result"],
      };
      db.matches.push(match);
    }
    notifyUniversityOfMatch(u.id, challengeId, match.matchScore, db);
  });
}
export const universityService = {
  getUniversities: () => readDB().universities,
  getProfile: (id: string) => readDB().universities.find((u) => u.id === id),
  getMatches: (id: string) =>
    readDB().matches.filter((m) => m.universityId === id),
  getRecommendedUniversities: (challengeId: string) =>
    readDB().matches.filter((m) => m.challengeId === challengeId),
  updateProfile: (id: string, data: UniversityProfile) => {
    const user = requireRole("university");
    if (user.universityId !== id) throw Error("Institution mismatch.");
    return mutate((db) => {
      const u = db.universities.find((u) => u.id === id);
      if (!u) throw Error("Institution not found.");
      Object.assign(u, data);
    });
  },
  decline: (challengeId: string) => {
    const user = requireRole("university");
    return mutate((db) => {
      const c = db.challenges.find((c) => c.id === challengeId);
      if (c?.universityId) throw Error("This challenge is already assigned.");
      const m = db.matches.find(
        (m) =>
          m.challengeId === challengeId && m.universityId === user.universityId,
      );
      if (!m) throw Error("Match not found.");
      m.declined = true;
    });
  },
};
