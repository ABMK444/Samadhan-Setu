import { apiRequest } from "./client.js";

export async function fetchHistory() {
  const data = await apiRequest("/history");
  return data.history;
}
