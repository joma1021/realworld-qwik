import { Resource, component$, useContext, useResource$, useSignal, useTask$ } from "@builder.io/qwik";
import type { ArticlesDTO } from "~/models/article";
import { getGlobalArticles, getYourArticles } from "~/services/article-service";
import type { OverviewStore } from "./article-overview";
import type { UserSessionStore } from "../auth/auth-provider";
import { UserSessionContext } from "../auth/auth-provider";
import { Tab } from "~/models/tab";
import { Article } from "./article";

interface ArticleListProps {
  overviewStore: OverviewStore;
}

export const ArticleList = component$((props: ArticleListProps) => {
  const pageNumber = useSignal(1);
  const userSession = useContext<UserSessionStore>(UserSessionContext);

  useTask$(({ track }) => {
    track(() => props.overviewStore.selectedTag);
    pageNumber.value = 1;
    console.log("tag update tracked");
  });

  const articles = useResource$<ArticlesDTO>(({ track, cleanup }) => {
    track(() => pageNumber.value);
    track(() => props.overviewStore.selectedTag);
    track(() => props.overviewStore.activeTab);
    const controller = new AbortController();
    cleanup(() => controller.abort());
    console.log("call article fetch");

    if (props.overviewStore.activeTab == Tab.Your) {
      return getYourArticles(userSession.authToken, controller, pageNumber.value);
    } else {
      return getGlobalArticles(controller, props.overviewStore.selectedTag, pageNumber.value);
    }
  });
  console.log("Render Article-List");
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
                  <Article article={article} key={article.slug} />
                ))}
              </ul>
            )}

            <ul class="pagination">
              {Array(Math.ceil(articles.articlesCount / 10))
                .fill(null)
                .map((_, i) => (
                  <li class={`page-item  ${i == pageNumber.value - 1 ? "active" : ""}`} key={i}>
                    <a
                      class="page-link"
                      style="cursor: pointer;"
                      onClick$={() => {
                        console.log(`pagenunber=${pageNumber.value}`);
                        pageNumber.value = i + 1;
                        console.log(`newpagenunber=${pageNumber.value}`);
                      }}
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}
            </ul>
          </>
        )}
      />
    </div>
  );
});
