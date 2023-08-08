import { Resource, component$, useContext, useResource$, useSignal, useTask$ } from "@builder.io/qwik";
import type { ArticlesDTO } from "~/models/article";
import { getGlobalArticles, getYourArticles } from "~/services/article-service";
import type { OverviewStore } from "./article-overview";
import type { UserSessionStore } from "../auth/auth-provider";
import { UserSessionContext } from "../auth/auth-provider";
import { Tab } from "~/models/tab";

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
      return getYourArticles(userSession.authToken, controller, props.overviewStore.selectedTag, pageNumber.value);
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
                  <div class="article-preview" key={article.slug}>
                    <div class="article-meta">
                      <a href={`/profile/${article.author.username}`}>
                        <img src={`${article.author.image}`} />
                      </a>
                      <div class="info">
                        <a href={`/profile/${article.author.username}`} class="author">
                          {article.author.username}
                        </a>
                        <span class="date">{article.createdAt}</span>
                      </div>
                      <button class="btn btn-outline-primary btn-sm pull-xs-right">
                        <i class="ion-heart"></i> {article.favoritesCount}
                      </button>
                    </div>
                    <a href={`/article/${article.slug}`} class="preview-link">
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      <ul class="tag-list">
                        {article.tagList.map((tag) => (
                          <li key={tag} class="tag-default tag-pill tag-outline">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </a>
                  </div>
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
