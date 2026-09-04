import { apiRequest } from "./client.js";

export async function fetchProblems() {
  const data = await apiRequest("/problems");
  return data.problems;
}

export async function uploadProblem(problemData) {
  const data = await apiRequest("/problems", {
    method: "POST",
    body: JSON.stringify(problemData),
  });
  return data.problem;
}

export async function updateProgress(dbId, { percentage, note, workerName }) {
  const data = await apiRequest(`/problems/${dbId}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ percentage, note, workerName }),
  });
  return data;
}

export async function completeProblem(dbId, completionDetails) {
  const data = await apiRequest(`/problems/${dbId}/complete`, {
    method: "POST",
    body: JSON.stringify(completionDetails),
  });
  return data;
}
