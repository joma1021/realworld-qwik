import { component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import FeedTabs from "~/components/tabs/feed-tabs";
import { ArticleList } from "~/components/articles/article-list";
import TagsSidebar from "~/components/tags/tags-sidebar";

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
      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <FeedTabs />
            <ArticleList />
          </div>

          <TagsSidebar />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Conduit - Home",
};
