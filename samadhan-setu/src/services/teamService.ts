import type { Team } from "../types";
import { mutate, readDB } from "./storage";
import { requireRole } from "./authService";
export const teamService = {
  getTeams: (universityId: string) =>
    readDB().teams.filter((t) => t.universityId === universityId),
  save: (team: Team) => {
    const user = requireRole("university");
    if (team.universityId !== user.universityId)
      throw Error("Institution mismatch.");
    if (
      !team.name.trim() ||
      !team.description.trim() ||
      !team.mentor.trim() ||
      team.members.some((m) => !m.name.trim() || !m.role.trim())
    )
      throw Error(
        "Enter team name, description, mentor and each member’s name and role.",
      );
    return mutate((db) => {
      const index = db.teams.findIndex((t) => t.id === team.id);
      if (index < 0) db.teams.push(team);
      else db.teams[index] = team;
    });
  },
};
