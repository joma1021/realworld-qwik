import { component$, useSignal, $, useContext, useResource$, Resource } from "@builder.io/qwik";
import { updateUserSession } from "~/common/helpers";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { clearAuthToken, getCurrentUser } from "~/services/auth-service";
import type { UserData } from "~/models/user";

export default component$(() => {
  const isLoading = useSignal(false);
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  const handleLogout = $(async () => {
    isLoading.value = true;

    await clearAuthToken();
    updateUserSession(userSession, "", "", false, "");

    console.log("Logout successful");
    navigate("/");
    isLoading.value = false;
  });

  const currentUser = useResource$<UserData>(() => {
    return getCurrentUser(userSession.authToken);
  });

  return (
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <ul class="error-messages">
              <li>Not implemented yet</li>
            </ul>

            <Resource
              value={currentUser}
              onPending={() => <div>Loading User-Data...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(currentUser) => (
                <form>
                  <fieldset>
                    <fieldset class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="URL of profile picture"
                        value={currentUser.image}
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <input
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Your Name"
                        value={currentUser.username}
                      />
                    </fieldset>

                    <fieldset class="form-group">
                      <textarea
                        class="form-control form-control-lg"
                        rows={8}
                        placeholder="Short bio about you"
                        value={currentUser.bio}
                      ></textarea>
                    </fieldset>
                    <fieldset class="form-group">
                      <input
                        class="form-control form-control-lg"
                        type="text"
                        placeholder="Email"
                        value={currentUser.email}
                      />
                    </fieldset>

                    <fieldset class="form-group">
                      <input class="form-control form-control-lg" type="password" placeholder="New Password" />
                    </fieldset>
                    <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
                  </fieldset>
                </form>
              )}
            />
            <hr />
            <button class="btn btn-outline-danger" onClick$={handleLogout} disabled={isLoading.value}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Conduit - Settings",
};
