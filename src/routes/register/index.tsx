import { component$, $, useStore } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { validateInput } from "~/common/helpers";
import { setToken } from "~/common/storage";
import AuthError from "~/components/errors/auth-error";
import type { RegisterCredentials } from "~/models/auth";
import { register } from "~/services/auth-service";

export interface RegisterStore {
  hasError: boolean;
  errorMessages: { [key: string]: string[] };
  isLoading: boolean;
}

export default component$(() => {
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
    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      registerStore.hasError = true;
      registerStore.errorMessages = data.errors;
    } else {
      console.log(data);
      // setUser(data.user);
      setToken(data.user.token);
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
              <a href="/login">Have an account?</a>
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