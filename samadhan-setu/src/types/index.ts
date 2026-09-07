export type Role = "citizen" | "university" | "industry" | "government";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  universityId?: string;
}
export interface Citizen extends User {
  contact?: string;
}
export interface IndustryPartner extends User {
  organisation?: string;
}
export interface UniversityProfile {
  name: string;
  type: string;
  district: string;
  website: string;
  description: string;
  departments: string;
  researchAreas: string;
  facultyExpertise: string;
  researchCentres: string;
  innovationCentres: string;
  incubationFacilities: string;
  laboratories: string;
  facilities: string;
  previousProjects: string;
}
export interface University extends UniversityProfile {
  id: string;
}
export interface ChallengeAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  alt: string;
}
export type ReviewStatus =
  | "Pending Review"
  | "Validated"
  | "Needs More Information"
  | "Rejected"
  | "Matched"
  | "Assigned";
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  district: string;
  block: string;
  village: string;
  location: string;
  population: number;
  duration: string;
  attempts: string;
  outcome: string;
  priority: string;
  citizenId: string;
  submittedBy: string;
  contact: string;
  date: string;
  reviewStatus: ReviewStatus;
  reviewNote: string;
  status: string;
  universityId?: string;
  attachments: ChallengeAttachment[];
  history: { date: string; label: string }[];
}
export interface UniversityMatch {
  universityId: string;
  challengeId: string;
  matchScore: number;
  matchingDomains: string[];
  matchingExpertise: string[];
  declined?: boolean;
}
export interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
}
export interface Team {
  id: string;
  universityId: string;
  name: string;
  description: string;
  departments: string;
  lab: string;
  mentor: string;
  coMentor: string;
  expertise: string;
  members: TeamMember[];
}
export const projectStatuses = [
  "Proposed",
  "Team Formation",
  "Research",
  "Prototype Development",
  "Testing",
  "Pilot Deployment",
  "Validation",
  "Completed",
  "On Hold",
  "Cancelled",
] as const;
export type ProjectStatus = (typeof projectStatuses)[number];
export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number;
}
export interface SolutionProposal {
  title: string;
  summary: string;
  solution: string;
  approach: string;
  impact: string;
  resources: string;
  timeline: string;
  collaboration: string;
  funding: number;
  attachments: ChallengeAttachment[];
}
export interface ProjectUpdate {
  id: string;
  title: string;
  date: string;
  description: string;
  milestone: string;
  progress: number;
  blockers: string;
  nextSteps: string;
  attachments: ChallengeAttachment[];
}
export interface Project {
  id: string;
  challengeId: string;
  universityId: string;
  title: string;
  department: string;
  mentor: string;
  teamId: string;
  duration: number;
  approach: string;
  lab: string;
  notes: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetDate: string;
  proposal?: SolutionProposal;
  milestones: Milestone[];
  updates: ProjectUpdate[];
  history: { date: string; label: string }[];
  testing: {
    description: string;
    result: string;
    attachments: ChallengeAttachment[];
  };
  collaborationRequired: string[];
}
export interface Notification {
  id: string;
  recipientId: string;
  category: string;
  message: string;
  date: string;
  read: boolean;
  path: string;
  dedupeKey?: string;
}
export interface CollaborationRequest {
  id: string;
  projectId: string;
  industryId: string;
  organisation: string;
  support: string;
  message: string;
  date: string;
}
export interface Database {
  challenges: Challenge[];
  universities: University[];
  matches: UniversityMatch[];
  projects: Project[];
  teams: Team[];
  notifications: Notification[];
  collaborations: CollaborationRequest[];
}
