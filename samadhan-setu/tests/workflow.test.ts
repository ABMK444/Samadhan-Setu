import test from "node:test";
import assert from "node:assert/strict";
import { authService } from "../src/services/authService";
import { challengeService } from "../src/services/challengeService";
import { solutionService } from "../src/services/solutionService";
import { universityService } from "../src/services/universityService";
import { notificationService } from "../src/services/notificationService";
import { teamService } from "../src/services/teamService";
import { collaborationService } from "../src/services/collaborationService";
import { readDB, resetDemo } from "../src/services/storage";
import type { Role } from "../src/types";
class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
}
Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
});
Object.defineProperty(globalThis, "sessionStorage", {
  value: new MemoryStorage(),
  configurable: true,
});
Object.defineProperty(globalThis, "window", {
  value: new EventTarget(),
  configurable: true,
});
const login = (role: Role) =>
  authService.login({
    email: `${role}@demo.in`,
    password: "Demo@123",
    role,
    remember: false,
  });

test("citizen → validation → matching → team → uptake → proposal → progress → completion", () => {
  resetDemo();
  login("citizen");
  const c = challengeService.createChallenge({
    title: "Solar lighting for a rural school",
    description:
      "The village school has unreliable power and needs a maintainable solar lighting system for classrooms.",
    category: "Energy",
    district: "Ranchi",
    block: "Angara",
    village: "Ward 2",
    location: "Near the community school",
    population: 400,
    duration: "Two years",
    attempts: "Battery lamps",
    outcome: "Reliable classroom lighting",
    priority: "High",
    contact: "citizen@example.org",
    attachments: [],
  });
  assert.equal(c.reviewStatus, "Pending Review");
  assert.throws(
    () => challengeService.review(c.id, "Validated", "Verified"),
    /role/,
  );
  login("government");
  challengeService.review(c.id, "Validated", "Community need verified.");
  assert.equal(
    challengeService.getChallengeById(c.id)?.reviewStatus,
    "Matched",
  );
  assert.equal(universityService.getRecommendedUniversities(c.id).length, 2);
  assert.equal(
    notificationService
      .getNotifications("UNI001")
      .filter((n) => n.path.endsWith(c.id)).length,
    1,
  );
  assert.equal(
    notificationService
      .getNotifications("UNI002")
      .filter((n) => n.path.endsWith(c.id)).length,
    0,
  );
  // Revalidation must not duplicate match notifications.
  challengeService.review(c.id, "Validated", "Verified again.");
  assert.equal(
    notificationService
      .getNotifications("UNI001")
      .filter((n) => n.path.endsWith(c.id)).length,
    1,
  );
  login("university");
  teamService.save({
    id: "TESTTEAM",
    universityId: "UNI001",
    name: "School Energy Group",
    description: "Electrical and education specialists.",
    departments: "Electrical Engineering",
    lab: "Energy Lab",
    mentor: "Dr. Demo",
    coMentor: "",
    expertise: "Solar systems",
    members: [
      {
        id: "M1",
        name: "Demo Student",
        department: "Electrical",
        role: "Design",
      },
    ],
  });
  const uptake = {
    title: "School solar lighting pilot",
    department: "Electrical Engineering",
    mentor: "Dr. Demo",
    teamId: "TESTTEAM",
    duration: 6,
    approach:
      "Survey demand, design a modular solar supply, and test with school staff.",
    lab: "Energy Lab",
    notes: "",
  };
  const p = solutionService.takeUpChallenge(c.id, "UNI001", uptake);
  assert.equal(
    challengeService.getChallengeById(c.id)?.reviewStatus,
    "Assigned",
  );
  assert.throws(
    () => solutionService.takeUpChallenge(c.id, "UNI001", uptake),
    /not available/,
  );
  solutionService.saveProposal(p.id, {
    title: "Solar pilot",
    summary:
      "Install a small modular solar lighting system in the village school.",
    solution: "Solar supply with maintainable batteries.",
    approach: "Survey, design, field test",
    impact: "Reliable classroom power",
    resources: "Solar panels and batteries",
    timeline: "Six months",
    collaboration: "Funding, Testing",
    funding: 100000,
    attachments: [],
  });
  solutionService.saveMilestone(p.id, {
    id: "MSTONE",
    title: "Prototype",
    description: "Build the solar supply",
    dueDate: "2026-12-01",
    status: "In Progress",
    progress: 45,
  });
  solutionService.saveUpdate(p.id, {
    id: "UPDATE",
    title: "First prototype built",
    date: "2026-09-07",
    description:
      "The first solar lighting prototype is ready for laboratory testing.",
    milestone: "MSTONE",
    progress: 45,
    blockers: "",
    nextSteps: "Run load tests",
    attachments: [],
  });
  solutionService.saveUpdate(p.id, {
    id: "UPDATE",
    title: "First prototype calibrated",
    date: "2026-09-07",
    description:
      "The first solar lighting prototype has now completed initial calibration.",
    milestone: "MSTONE",
    progress: 50,
    blockers: "",
    nextSteps: "Run load tests",
    attachments: [],
  });
  assert.equal(solutionService.getProjectById(p.id)?.updates.length, 1);
  assert.equal(solutionService.getProjectById(p.id)?.progress, 50);
  assert.throws(
    () => solutionService.updateStatus(p.id, "Research", 101),
    /0 and 100/,
  );
  solutionService.updateStatus(p.id, "Prototype Development", 50);
  solutionService.saveTesting(p.id, {
    description: "Bench tests passed at rated load.",
    result: "Passed",
    attachments: [],
  });
  login("industry");
  collaborationService.expressInterest(
    p.id,
    "Funding",
    "We can contribute to the pilot.",
  );
  assert.throws(
    () => collaborationService.expressInterest(p.id, "Funding", "Duplicate"),
    /already/,
  );
  assert.ok(
    notificationService
      .getNotifications("UNI001")
      .some((n) => n.category === "Industry Interest"),
  );
  login("university");
  solutionService.saveMilestone(p.id, {
    id: "MSTONE",
    title: "Prototype",
    description: "Complete prototype",
    dueDate: "2026-12-01",
    status: "Completed",
    progress: 50,
  });
  assert.equal(
    solutionService.getProjectById(p.id)?.milestones[0].progress,
    100,
  );
  solutionService.updateStatus(p.id, "Completed", 50);
  assert.equal(solutionService.getProjectById(p.id)?.progress, 100);
  assert.equal(challengeService.getChallengeById(c.id)?.status, "Completed");
  login("government");
  assert.equal(
    readDB().projects.find((x) => x.id === p.id)?.status,
    "Completed",
  );
  assert.throws(
    () => challengeService.review(c.id, "Rejected", "No longer needed"),
    /Assigned/,
  );
  login("citizen");
  assert.ok(
    notificationService
      .getNotifications("CIT001")
      .some((n) => n.category === "Project Completed" && n.path.endsWith(c.id)),
  );
});

test("authentication, declined challenges, persistence, reset and storage failures", () => {
  resetDemo();
  assert.throws(
    () =>
      authService.login({
        role: "university",
        email: "citizen@demo.in",
        password: "Demo@123",
        remember: false,
      }),
    /demo email/,
  );
  login("university");
  universityService.decline("JSI-2026-0142");
  assert.equal(
    universityService
      .getMatches("UNI001")
      .find((m) => m.challengeId === "JSI-2026-0142")?.declined,
    true,
  );
  authService.logout();
  assert.equal(authService.getCurrentUser(), null);
  login("university");
  assert.equal(
    universityService
      .getMatches("UNI001")
      .find((m) => m.challengeId === "JSI-2026-0142")?.declined,
    true,
  );
  resetDemo();
  assert.equal(
    universityService
      .getMatches("UNI001")
      .find((m) => m.challengeId === "JSI-2026-0142")?.declined,
    undefined,
  );
  const original = localStorage.setItem.bind(localStorage);
  localStorage.setItem = () => {
    throw Error("Quota exceeded");
  };
  assert.throws(
    () => universityService.decline("JSI-2026-0142"),
    /Unable to save/,
  );
  localStorage.setItem = original;
  assert.equal(
    universityService
      .getMatches("UNI001")
      .find((m) => m.challengeId === "JSI-2026-0142")?.declined,
    undefined,
  );
});
