import type { UserSessionStore } from "~/components/auth/auth-provider";
import type { UserData } from "~/models/user";

export const validateInput = (input: string) => {
  if (input == "") return true;
  return false;
};

export const updateUserSession = (userSession: UserSessionStore, user: UserData | null, isLoggedIn: boolean) => {
  userSession.user = user;
  userSession.isLoggedIn = isLoggedIn;
};
