import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import styles from "./global.css?inline";
import type { UserData } from "./models/user";
import { getToken } from "./common/storage";
import { getCurrentUser } from "./services/auth-service";
import { updateUserSession } from "./common/helpers";

export const UserSessionContext = createContextId<UserSessionStore>("user-session");
export interface UserSessionStore {
  user: UserData | null;
  isLoggedIn: boolean;
}

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  useStyles$(styles);
  const userSession = useStore<UserSessionStore>({ user: null, isLoggedIn: false });
  useVisibleTask$(async () => {
    const response = getToken() ? await getCurrentUser() : null;

    if (response != null) {
      updateUserSession(userSession, response, true);
    }
  });

  useContextProvider(UserSessionContext, userSession);
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <title>Conduit</title>
        <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <link
          href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
