import { component$, $, useStore, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { updateUserSession, validateInput } from "~/common/helpers";
import { UserSessionContext, type UserSessionStore } from "~/common/auth/auth-provider";
import AuthError from "~/components/errors/form-error";
import type { RegisterCredentials } from "~/models/auth";
import { register } from "~/services/auth-service";

export interface RegisterStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
}

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const registerStore = useStore<RegisterStore>({ hasError: false, errorMessages: { [""]: [""] }, isLoading: false });
  const navigate = useNavigate();

  const handleSubmit = $(async (event: any) => {
    registerStore.isLoading = true;

    const email = event.target.email.value;
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (validateInput(username)) {
      registerStore.errorMessages = { [username]: ["username can't be blank"] };
      registerStore.hasError = true;
      registerStore.isLoading = false;
      return;
    }

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

    const credentials: RegisterCredentials = {
      username: username,
      email: email,
      password: password,
    };
    const response = await register(credentials);
    if (!response.ok) {
      if (response.status == 422) {
        registerStore.hasError = true;
        const data = await response.json();
        data.status == "error"
          ? (registerStore.errorMessages = { ["Error: "]: [data.message] })
          : (registerStore.errorMessages = data.errors);
      } else {
        registerStore.hasError = true;
        registerStore.errorMessages = { [""]: ["unknown error"] };
      }
    } else {
      const data = await response.json();
      updateUserSession(userSession, data.user.username, data.user.image, true, data.user.token);
      console.log("Register successful");
      navigate("/");
    }
    registerStore.isLoading = false;
  });

  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign up</h1>
            <p class="text-xs-center">
              <Link href="/login">Have an account?</Link>
            </p>
            {registerStore.hasError && <AuthError errors={registerStore.errorMessages} />}

            <form onSubmit$={handleSubmit} preventdefault:submit>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="username" type="text" placeholder="Username" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="email" type="email" placeholder="Email" />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" name="password" type="password" placeholder="Password" />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={registerStore.isLoading}>
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Conduit - Register",
};
