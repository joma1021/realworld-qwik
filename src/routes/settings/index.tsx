import { component$, useSignal, $, useContext } from "@builder.io/qwik";
import { clearToken } from "~/common/storage";
import { updateUserSession } from "~/common/helpers";
import type { UserSessionStore } from "~/components/auth/auth-provider";
import { UserSessionContext } from "~/components/auth/auth-provider";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  const isLoading = useSignal(false);
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const navigate = useNavigate();

  const handleLogout = $(async () => {
    isLoading.value = true;

    clearToken();
    updateUserSession(userSession, null, false);

    console.log("Register successful");
    navigate("/");
    isLoading.value = false;
  });

  return (
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <ul class="error-messages">
              <li>That name is required</li>
            </ul>

            <form>
              <fieldset>
                <fieldset class="form-group">
                  <input class="form-control" type="text" placeholder="URL of profile picture" />
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
                </fieldset>
                <fieldset class="form-group">
                  <textarea class="form-control form-control-lg" rows={8} placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Email" />
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="New Password" />
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
              </fieldset>
            </form>
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
