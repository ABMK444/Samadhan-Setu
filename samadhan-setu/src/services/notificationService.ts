import type { Database, Notification } from "../types";
import { mutate, readDB, uid } from "./storage";
export const MATCH_NOTIFICATION_THRESHOLD = 75;
export function addNotification(
  db: Database,
  input: Omit<Notification, "id" | "date" | "read">,
) {
  if (
    input.dedupeKey &&
    db.notifications.some((n) => n.dedupeKey === input.dedupeKey)
  )
    return;
  db.notifications.unshift({
    ...input,
    id: uid("NOT"),
    date: new Date().toISOString(),
    read: false,
  });
}
// TODO: Replace with backend notification/email/SMS/push service.
export function notifyUniversityOfMatch(
  universityId: string,
  challengeId: string,
  score: number,
  transaction?: Database,
) {
  if (score < MATCH_NOTIFICATION_THRESHOLD) return;
  const add = (db: Database) =>
    addNotification(db, {
      recipientId: universityId,
      category: "New Challenge Match",
      message: `${db.challenges.find((c) => c.id === challengeId)?.title || challengeId} matches your institution at ${score}%.`,
      path: `/university/challenges/${challengeId}`,
      dedupeKey: `match:${universityId}:${challengeId}`,
    });
  if (transaction) add(transaction);
  else mutate(add);
}
export const notificationService = {
  getNotifications: (id: string) =>
    readDB().notifications.filter((n) => n.recipientId === id),
  markRead: (id: string, recipientId: string) =>
    mutate((db) => {
      const n = db.notifications.find(
        (n) => n.id === id && n.recipientId === recipientId,
      );
      if (n) n.read = true;
    }),
  markAllRead: (id: string) =>
    mutate((db) =>
      db.notifications
        .filter((n) => n.recipientId === id)
        .forEach((n) => (n.read = true)),
    ),
  notifyUniversityOfMatch,
};
