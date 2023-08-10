import { Slot, component$, createContextId, useContextProvider, useStore, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

import { updateUserSession } from "~/common/helpers";

export const UserSessionContext = createContextId<UserSessionStore>("user-session");
export interface UserSessionStore {
  username: string;
  image: string | undefined;
  isLoggedIn: boolean;
  authToken: string;
}

export interface AutCookies {
  username: string | undefined;
  image: string | undefined;
  authToken: string | undefined;
}

const getAuthCookies = server$(async function (): Promise<AutCookies> {
  const username = this.cookie.get("username")?.value;
  const image = this.cookie.get("image")?.value;
  const authToken = this.cookie.get("authToken")?.value;

  return { username, image, authToken };
});

export default component$(() => {
  const userSession = useStore<UserSessionStore>({ username: "", image: "", isLoggedIn: false, authToken: "" });
  useTask$(async () => {
    const authCookies = await getAuthCookies();

    if (!authCookies.username || !authCookies.authToken) {
      console.log("Auth failed");
      return;
    }

    updateUserSession(userSession, authCookies.username, authCookies.image, true, authCookies.authToken);
    console.log("Auth successful");
  });

  useContextProvider(UserSessionContext, userSession);
  return (
    <>
      <Slot />
    </>
  );
});
