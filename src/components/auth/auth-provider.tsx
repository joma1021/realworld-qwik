import { Slot, component$, createContextId, useContextProvider, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { updateUserSession } from "~/common/helpers";
import { getToken } from "~/common/storage";
import type { UserData } from "~/models/user";
import { getCurrentUser } from "~/services/auth-service";

export const UserSessionContext = createContextId<UserSessionStore>("user-session");
export interface UserSessionStore {
  user: UserData | null;
  isLoggedIn: boolean;
}

export default component$(() => {
  const userSession = useStore<UserSessionStore>({ user: null, isLoggedIn: false });
  useVisibleTask$(async () => {
    const response = getToken() ? await getCurrentUser() : null;

    if (response != null) {
      console.log("i was here");
      updateUserSession(userSession, response, true);
    }
  });

  useContextProvider(UserSessionContext, userSession);
  return (
    <>
      <Slot />
    </>
  );
});
