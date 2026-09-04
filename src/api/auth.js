import { apiRequest, setToken, clearToken, getToken } from "./client.js";

export async function registerUser({ name, email, password, role, orgName, district, phone }) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role, orgName, district, phone }),
  });
  setToken(data.token);
  return data;
}

export async function loginUser({ email, password }) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getCurrentUser() {
  if (!getToken()) return null;
  try {
    const data = await apiRequest("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export function logoutUser() {
  clearToken();
}

export function isLoggedIn() {
  return !!getToken();
}
