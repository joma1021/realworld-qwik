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
export async function getCurrentUser(): Promise<UserData> {
  return fetch("https://api.realworld.io/api/user", {
    method: "GET",
    headers: getHeaders(),
  })
    .then((res) => res.json())
    .then((res) => res.user);
}

export async function updateUser(user: unknown) {
  return fetch("https://api.realworld.io/api/user", {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ user }),
  });
}
