const TOKEN_KEY = "auth-token";

export function setToken(token: string): void {
  const now = new Date();
  now.setTime(now.getTime() + 24 * 60 * 60 * 1000);
  const expires = "; expires=" + now.toUTCString();

  document.cookie = `${TOKEN_KEY}=${token}${expires}; path=/`;
}

export function clearToken(): void {
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
