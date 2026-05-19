// frontend/src/services/authService.js

import { API_BASE } from "./config";

/**
 * Signup
 */
export async function signup(email, password1, password2) {
  const response = await fetch(`${API_BASE}/en/api/auth/registration/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      username: email,
      password1,
      password2,
    }),
  });

  return await response.json();
}

/**
 * Login
 */
export async function login(loginInput, password) {
  const body = loginInput.includes("@")
    ? { email: loginInput, password }
    : { username: loginInput, password };

  const response = await fetch(`${API_BASE}/en/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return await response.json();
}

/**
 * Logout (server-side only)
 * IMPORTANT: no localStorage here (handled in UI)
 */
export async function logout(token) {
  const response = await fetch(`${API_BASE}/en/api/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  return await response.json();
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE}/en/api/auth/user/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
}

/**
 * 🧨 Delete account (NEW)
 */
export async function deleteAccount(token) {
  const response = await fetch(
    `${API_BASE}/en/api/auth/delete-account/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete account");
  }

  return await response.json();
}