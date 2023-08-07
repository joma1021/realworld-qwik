import { component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import ArticleOverview from "../components/articles/article-overview";
import type { UserSessionStore } from "~/components/auth/auth-provider";
import { UserSessionContext } from "~/components/auth/auth-provider";

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  return (
    <div class="home-page">
      {!userSession.isLoggedIn && (
        <div class="banner">
          <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <ArticleOverview />
    </div>
  );
});

export const head: DocumentHead = {
  title: "conduit with Qwik",
  meta: [
    {
      name: "description",
      content: "A place to share your knowledge.",
    },
  ],
};
