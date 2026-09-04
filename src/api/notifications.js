import { apiRequest } from "./client.js";

export async function fetchNotifications() {
  const data = await apiRequest("/notifications");
  return data.notifications;
}

export async function markNotificationRead(dbId) {
  const data = await apiRequest(`/notifications/${dbId}/read`, { method: "PATCH" });
  return data;
}
