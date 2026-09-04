import { apiRequest } from "./client.js";

export async function fetchThreads() {
  const data = await apiRequest("/messages/threads");
  return data.threads;
}

export async function startThread(problemDbId, initialMessage) {
  const data = await apiRequest("/messages/threads", {
    method: "POST",
    body: JSON.stringify({ problemDbId, initialMessage }),
  });
  return data;
}

export async function fetchMessages(threadDbId) {
  const data = await apiRequest(`/messages/threads/${threadDbId}`);
  return data.messages;
}

export async function sendMessage(threadDbId, text) {
  const data = await apiRequest(`/messages/threads/${threadDbId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return data;
}
