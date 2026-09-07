import { mutate, readDB, uid, today } from "./storage";
import { requireRole } from "./authService";
import { addNotification } from "./notificationService";
export const collaborationService = {
  getRequests: () => readDB().collaborations,
  expressInterest: (projectId: string, support: string, message: string) => {
    const user = requireRole("industry");
    return mutate((db) => {
      const p = db.projects.find((p) => p.id === projectId);
      if (
        !p ||
        !p.collaborationRequired.length ||
        ["Completed", "Cancelled"].includes(p.status)
      )
        throw Error("This project is not seeking collaboration.");
      if (
        db.collaborations.some(
          (c) =>
            c.projectId === projectId &&
            c.industryId === user.id &&
            c.support === support,
        )
      )
        throw Error("You have already offered this type of support.");
      db.collaborations.push({
        id: uid("COL"),
        projectId,
        industryId: user.id,
        organisation: user.name,
        support,
        message,
        date: today(),
      });
      addNotification(db, {
        recipientId: p.universityId,
        category: "Industry Interest",
        message: `${user.name} offers ${support.toLowerCase()} for ${p.title}.`,
        path: `/university/projects/${p.id}`,
      });
    });
  },
};
