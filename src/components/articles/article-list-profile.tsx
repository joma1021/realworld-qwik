import { Resource, component$, useContext, useResource$, useStore } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";
import type { ArticlesDTO } from "~/models/article";
import { Tab } from "~/models/tab";
import { getProfileArticles } from "~/services/article-service";
import ProfileTabs from "../tabs/profile-tabs";
import { ArticlePreview } from "./article-preview";

export const ArticleListProfile = component$((props: { username: string }) => {
  const { url } = useLocation();
  const profileStore = useStore({ filter: Tab.My, page: Number(url.searchParams.get("page") ?? 1) });
  const userSession = useContext<UserSessionStore>(UserSessionContext);

  const articles = useResource$<ArticlesDTO>(({ track, cleanup }) => {
    track(() => url);
    const controller = new AbortController();
    const filter = url.searchParams.get("filter");
    if (filter) profileStore.filter = filter;
    profileStore.page = Number(url.searchParams.get("page") ?? 1);
    cleanup(() => controller.abort());

    if (profileStore.filter == Tab.My) {
      return getProfileArticles(props.username, profileStore.filter, userSession.authToken, controller, profileStore.page);
    } else {
      return getProfileArticles(props.username, profileStore.filter, userSession.authToken, controller, profileStore.page);
    }
  });
  return (
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <ProfileTabs />

          <Resource
            value={articles}
            onPending={() => <div>Loading Articles...</div>}
            onRejected={(reason) => <div>Error: {reason}</div>}
            onResolved={(articles) => (
              <>
                {articles.articles.length == 0 ? (
                  <div>No articles are here... yet.</div>
                ) : (
                  <ul>
                    {articles.articles.map((article) => (
                      <ArticlePreview article={article} key={article.slug} />
                    ))}
                  </ul>
                )}

                <ul class="pagination">
                  {Array(Math.ceil(articles.articlesCount / 5))
                    .fill(null)
                    .map((_, i) => (
                      <li class={`page-item  ${i == profileStore.page - 1 ? "active" : ""}`} key={i}>
                        <Link
                          class="page-link"
                          style="cursor: pointer;"
                          href={`?filter=${profileStore.filter}&page=${i + 1}`}
                        >
                          {i + 1}
                        </Link>
                      </li>
                    ))}
                </ul>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
});
