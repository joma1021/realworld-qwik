import { component$, $, useStore, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { updateUserSession, validateInput } from "~/common/helpers";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import AuthError from "~/components/errors/form-error";
import type { LoginCredentials } from "~/models/auth";
import { login } from "~/services/auth-service";

export interface LoginStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
}

export default component$(() => {
  const loginStore = useStore<LoginStore>({ hasError: false, errorMessages: { [""]: [""] }, isLoading: false });
  const navigate = useNavigate();
  const userSession = useContext<UserSessionStore>(UserSessionContext);

  const handleSubmit = $(async (event: any) => {
    loginStore.isLoading = true;

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (validateInput(email)) {
      loginStore.errorMessages = { [email]: ["email can't be blank"] };
      loginStore.hasError = true;
      loginStore.isLoading = false;
      return;
    }

    if (validateInput(password)) {
      loginStore.errorMessages = { [password]: ["password can't be blank"] };
      loginStore.hasError = true;
      loginStore.isLoading = false;
      return;
    }

    const credentials: LoginCredentials = {
      email: email,
      password: password,
    };
    const response = await login(credentials);
    if (!response.ok) {
      if (response.status == 403 || response.status == 422) {
        loginStore.hasError = true;
        const data = await response.json();
        data.status == "error"
          ? (loginStore.errorMessages = { ["Error: "]: [data.message] })
          : (loginStore.errorMessages = data.errors);
      } else {
        loginStore.hasError = true;
        loginStore.errorMessages = { [""]: ["unknown error"] };
      }
    } else {
      const data = await response.json();
      updateUserSession(userSession, data.user.username, data.user.image, true, data.user.token);
      console.log("Login successful");
      navigate("/");
    }

    loginStore.isLoading = false;
  });

  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
              <Link href="/register">Need an account?</Link>
            </p>
            {loginStore.hasError && <AuthError errors={loginStore.errorMessages} />}

            <form onSubmit$={handleSubmit} preventdefault:submit>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="email" type="email" placeholder="Email" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="password" type="password" placeholder="Password" />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={loginStore.isLoading}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Conduit - Login",
};
