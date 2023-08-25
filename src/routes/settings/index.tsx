import { component$, $, useContext, useResource$, Resource, useStore } from "@builder.io/qwik";
import { updateUserSession, validateInput } from "~/common/helpers";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { clearAuthToken, getCurrentUser, updateUser } from "~/services/auth-service";
import type { UpdateUser, UserData } from "~/models/user";
import FormError from "~/components/errors/form-error";

export interface SettingsStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
}

export default component$(() => {
  const settingsStore = useStore<SettingsStore>({ hasError: false, errorMessages: { [""]: [""] }, isLoading: false });
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  const handleLogout = $(async () => {
    settingsStore.isLoading = true;

    await clearAuthToken();
    updateUserSession(userSession, "", "", false, "");

    console.log("Logout successful");
    navigate("/");
    settingsStore.isLoading = false;
  });

  const currentUser = useResource$<UserData>(() => {
    return getCurrentUser(userSession.authToken);
  });

  const handleSubmit = $(async (event: any) => {
    settingsStore.isLoading = true;

    const email = event.target.email.value;
    const image = event.target.image.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const bio = event.target.bio.value;

    if (validateInput(username)) {
      settingsStore.errorMessages = { [username]: ["username can't be blank"] };
      settingsStore.hasError = true;
      settingsStore.isLoading = false;
      return;
    }

    if (validateInput(email)) {
      settingsStore.errorMessages = { [email]: ["email can't be blank"] };
      settingsStore.hasError = true;
      settingsStore.isLoading = false;
      return;
    }

    if (validateInput(image)) {
      settingsStore.errorMessages = { [image]: ["image can't be blank"] };
      settingsStore.hasError = true;
      settingsStore.isLoading = false;
      return;
    }

    const user: UpdateUser = {
      username: username,
      email: email,
      image: image,
    };
    if (bio) user.bio = bio;
    if (password) user.password = password;
    const response = await updateUser(user, userSession.authToken);

    if (!response.ok) {
      settingsStore.hasError = true;
      settingsStore.errorMessages = { [""]: ["unknown error"] };
    } else {
      const data = await response.json();
      updateUserSession(userSession, data.user.username, data.user.image, true, data.user.token);

      navigate("/");
    }
    settingsStore.isLoading = false;
  });

  return (
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            {settingsStore.hasError && <FormError errors={settingsStore.errorMessages} />}
            <Resource
              value={currentUser}
              onPending={() => <div>Loading User-Data...</div>}
              onRejected={(reason) => <div>Error: {reason}</div>}
              onResolved={(currentUser) => (
                <form onSubmit$={handleSubmit} preventdefault:submit>
                  <fieldset>
                    <fieldset class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        name="image"
                        placeholder="URL of profile picture"
                        value={currentUser.image}
                      />
                    </fieldset>
                    <fieldset class="form-group">
                      <input
                        class="form-control form-control-lg"
                        type="text"
                        name="username"
                        placeholder="Your Name"
                        value={currentUser.username}
                      />
                    </fieldset>

                    <fieldset class="form-group">
                      <textarea
                        class="form-control form-control-lg"
                        rows={8}
                        name="bio"
                        placeholder="Short bio about you"
                        value={currentUser.bio}
                      ></textarea>
                    </fieldset>
                    <fieldset class="form-group">
                      <input
                        class="form-control form-control-lg"
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={currentUser.email}
                      />
                    </fieldset>

                    <fieldset class="form-group">
                      <input
                        class="form-control form-control-lg"
                        type="password"
                        name="password"
                        placeholder="New Password"
                      />
                    </fieldset>
                    <button
                      class="btn btn-lg btn-primary pull-xs-right"
                      type="submit"
                      disabled={settingsStore.isLoading}
                    >
                      Update Settings
                    </button>
                  </fieldset>
                </form>
              )}
            />
            <hr />
            <button class="btn btn-outline-danger" onClick$={handleLogout} disabled={settingsStore.isLoading}>
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
