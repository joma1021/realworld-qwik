import type { UserData } from "~/models/user";
import type { UserSessionStore } from "~/root";

export const validateInput = (input: string) => {
  if (input == "") return true;
  return false;
};

export const updateUserSession = (userSession: UserSessionStore, user: UserData, isLoggedIn: boolean) => {
  userSession.user = user;
  userSession.isLoggedIn = isLoggedIn;
};
