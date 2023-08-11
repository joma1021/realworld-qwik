import type { UserSessionStore } from "~/common/auth/auth-provider";

export const validateInput = (input: string) => {
  if (input == "") return true;
  return false;
};

export const updateUserSession = (
  userSession: UserSessionStore,
  username: string,
  image: string | undefined,
  isLoggedIn: boolean,
  authToken: string
) => {
  userSession.username = username;
  userSession.image = image;
  userSession.isLoggedIn = isLoggedIn;
  userSession.authToken = authToken;
};
