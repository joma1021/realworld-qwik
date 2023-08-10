import { getHeaders } from "~/common/headers";
import type { LoginCredentials, RegisterCredentials } from "~/models/auth";
import type { UserData } from "~/models/user";

export async function login(credentials: LoginCredentials) {
  return fetch("https://api.realworld.io/api/users/login", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ user: credentials }),
  });
}
export async function register(credentials: RegisterCredentials) {
  return fetch("https://api.realworld.io/api/users", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ user: credentials }),
  });
}
export async function getCurrentUser(token: string): Promise<UserData> {
  return fetch("https://api.realworld.io/api/user", {
    method: "GET",
    headers: getHeaders(token),
  })
    .then((res) => res.json())
    .then((res) => res.user);
}

export async function updateUser(user: unknown, token: string) {
  return fetch("https://api.realworld.io/api/user", {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify({ user }),
  });
}

export async function setAuthCookies(user: UserData) {
  await fetch("/middleware/auth", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ token: user.token, username: user.username, image: user.image }),
    credentials: "include",
  });
}

export async function clearAuthToken() {
  await fetch("/middleware/auth", {
    method: "DELETE",
    headers: getHeaders(),
    credentials: "include",
  });
}
