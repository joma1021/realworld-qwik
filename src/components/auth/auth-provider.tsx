import {
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

import { setUserSessionToken, updateUserSession } from "~/common/helpers";
import type { UserData } from "~/models/user";
import { getCurrentUser } from "~/services/auth-service";

export const UserSessionContext = createContextId<UserSessionStore>("user-session");
export interface UserSessionStore {
  user: UserData | null;
  isLoggedIn: boolean;
  authToken: string;
}

const authToken = server$(async function () {
  const data = await this.cookie.get("auth-token");

  return data?.value;
});

export default component$(() => {
  const userSession = useStore<UserSessionStore>({ user: null, isLoggedIn: false, authToken: "" });
  useTask$(async () => {
    const token = await authToken();

    if (token != null) {
      console.log("i was here: useTask");

      setUserSessionToken(userSession, true, token);
    }
    // else {
    //   clearToken();
    //   updateUserSession(userSession, null, false, "");

    //   console.log("Auto logout successful");
    // }
  });
  useVisibleTask$(async () => {
    const token = userSession.authToken;
    const response = token ? await getCurrentUser(token) : null;

    if (response != null) {
      console.log("i was here: visibleTask");
      updateUserSession(userSession, response, true, token);
    }
  });

  useContextProvider(UserSessionContext, userSession);
  return (
    <>
      <Slot />
    </>
  );
});
