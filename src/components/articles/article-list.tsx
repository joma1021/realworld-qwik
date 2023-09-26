import { Resource, component$, useContext, useResource$, useStore } from "@builder.io/qwik";
import type { ArticlesDTO } from "~/models/article";
import { getGlobalArticles, getYourArticles } from "~/services/article-service";
import type { UserSessionStore } from "../../common/auth/auth-provider";
import { UserSessionContext } from "../../common/auth/auth-provider";
import { ArticlePreview } from "./article-preview";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Tab } from "~/models/tab";

export const ArticleList = component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const { url } = useLocation();
  const articleListStore = useStore({ filter: userSession.isLoggedIn ? Tab.Your : Tab.Global, page: Number(url.searchParams.get("page") ?? 1) });

  const articles = useResource$<ArticlesDTO>(({ track, cleanup }) => {
    track(() => url);
    const filter = url.searchParams.get("filter");
    if (filter) articleListStore.filter = filter;
    articleListStore.page = Number(url.searchParams.get("page") ?? 1);
    const controller = new AbortController();
    cleanup(() => controller.abort());

    if (articleListStore.filter == Tab.Your) {
      return getYourArticles(userSession.authToken, controller, articleListStore.page);
    } else if (articleListStore.filter == Tab.Global) {
      return getGlobalArticles(controller, articleListStore.page, userSession.authToken);
    } else {
      return getGlobalArticles(controller, articleListStore.page, userSession.authToken, articleListStore.filter);
    }
  });
  return (
    <div>
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
              {Array(Math.ceil(articles.articlesCount / 10))
                .fill(null)
                .map((_, i) => (
                  <li class={`page-item  ${i == articleListStore.page - 1 ? "active" : ""}`} key={i}>
                    <Link class="page-link" style="cursor: pointer;" href={`/?filter=${articleListStore.filter}&page=${i + 1}`}>
                      {i + 1}
                    </Link>
                  </li>
                ))}
            </ul>
          </>
        )}
      />
    </div>
  );
});
