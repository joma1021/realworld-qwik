import type { UserSessionStore } from "~/components/auth/auth-provider";
import type { UserData } from "~/models/user";

export const validateInput = (input: string) => {
  if (input == "") return true;
  return false;
};

export const updateUserSession = (
  userSession: UserSessionStore,
  user: UserData | null,
  isLoggedIn: boolean,
  authToken: string
) => {
  userSession.user = user;
  userSession.isLoggedIn = isLoggedIn;
  userSession.authToken = authToken;
};

export const setUserSessionToken = (userSession: UserSessionStore, authToken: string) => {
  userSession.authToken = authToken;
};
