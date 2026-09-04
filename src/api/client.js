const API_BASE = "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("samadhansetu_token");
}

function setToken(token) {
  localStorage.setItem("samadhansetu_token", token);
}

function clearToken() {
  localStorage.removeItem("samadhansetu_token");
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

export { apiRequest, getToken, setToken, clearToken, API_BASE };
