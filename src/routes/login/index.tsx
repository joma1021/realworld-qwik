import { component$, $, useStore, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { updateUserSession, validateInput } from "~/common/helpers";
import { setToken } from "~/common/storage";
import type { UserSessionStore } from "~/components/auth/auth-provider";
import { UserSessionContext } from "~/components/auth/auth-provider";
import AuthError from "~/components/errors/auth-error";
import type { LoginCredentials } from "~/models/auth";
import { login } from "~/services/auth-service";

export interface LoginStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
}

export default component$(() => {
  const registerStore = useStore<LoginStore>({ hasError: false, errorMessages: { [""]: [""] }, isLoading: false });
  const navigate = useNavigate();
  const userSession = useContext<UserSessionStore>(UserSessionContext);

  const handleSubmit = $(async (event: any) => {
    registerStore.isLoading = true;

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (validateInput(email)) {
      registerStore.errorMessages = { [email]: ["email can't be blank"] };
      registerStore.hasError = true;
      registerStore.isLoading = false;
      return;
    }

    if (validateInput(password)) {
      registerStore.errorMessages = { [password]: ["password can't be blank"] };
      registerStore.hasError = true;
      registerStore.isLoading = false;
      return;
    }

    const credentials: LoginCredentials = {
      email: email,
      password: password,
    };
    const response = await login(credentials);
    const data = await response.json();

    if (!response.ok) {
      console.log(data.errors);
      registerStore.hasError = true;
      registerStore.errorMessages = data.errors;
    } else {
      setToken(data.user.token);
      updateUserSession(userSession, data.user, true, data.user.token);
      console.log("Login successful");
      navigate("/");
    }

    registerStore.isLoading = false;
  });

  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>
            {registerStore.hasError && <AuthError errors={registerStore.errorMessages} />}

            <form onSubmit$={handleSubmit} preventdefault:submit>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="email" type="email" placeholder="Email" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="password" type="password" placeholder="Password" />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={registerStore.isLoading}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});
