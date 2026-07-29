import type { UserSessionStore } from "~/common/auth/auth-provider";
import { resolveImage } from "~/common/api";

export const validateInput = (input: string) => {
  if (input == "") return true;
  return false;
};

export const updateUserSession = (
  userSession: UserSessionStore,
  username: string,
  image: string | null | undefined,
  isLoggedIn: boolean,
  authToken: string
) => {
  userSession.username = username;
  userSession.image = isLoggedIn ? resolveImage(image) : undefined;
  userSession.isLoggedIn = isLoggedIn;
  userSession.authToken = authToken;
};

/** Normalize RealWorld / FastAPI error payloads into field -> messages maps. */
export function parseApiErrors(data: unknown): { [key: string]: string[] } {
  if (!data || typeof data !== "object") {
    return { [""]: ["unknown error"] };
  }

  const payload = data as {
    errors?: { [key: string]: string[] };
    status?: string;
    message?: string;
    detail?: Array<{ loc?: Array<string | number>; msg?: string }>;
  };

  if (payload.errors && typeof payload.errors === "object") {
    return payload.errors;
  }

  if (payload.status === "error" && payload.message) {
    return { ["Error: "]: [payload.message] };
  }

  if (Array.isArray(payload.detail)) {
    const errors: { [key: string]: string[] } = {};
    for (const item of payload.detail) {
      const field = Array.isArray(item.loc) ? String(item.loc[item.loc.length - 1] ?? "error") : "error";
      const message = item.msg ?? "invalid";
      errors[field] = [...(errors[field] ?? []), message];
    }
    return Object.keys(errors).length ? errors : { [""]: ["unknown error"] };
  }

  return { [""]: ["unknown error"] };
}
