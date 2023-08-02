import { Resource, component$, useResource$, useStore, useTask$ } from "@builder.io/qwik";
import type { ArticlesDTO } from "~/models/article";
import { getGlobalArticles } from "~/services/article-service";
import type { OverviewStore } from "../overview";

interface ArticleListProps {
  overviewStore: OverviewStore;
}

export const ArticleList = component$((props: ArticleListProps) => {
  const articleListStore = useStore({ pageNumber: 1 });

  useTask$(({ track, cleanup }) => {
    track(() => props.overviewStore.selectedTag);
    articleListStore.pageNumber = 1;
    console.log("tag update tracked");
    const controller = new AbortController();
    cleanup(() => controller.abort());
  });

  const articles = useResource$<ArticlesDTO>(({ track, cleanup }) => {
    track(() => articleListStore.pageNumber);
    track(() => props.overviewStore.selectedTag);
    const controller = new AbortController();
    cleanup(() => controller.abort());
    console.log("call article fetch");
    return getGlobalArticles(controller, props.overviewStore.selectedTag, articleListStore.pageNumber);
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
            <ul>
              {articles.articles.map((article, i) => (
                <div class="article-preview" key={i}>
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
                  <a href={`${article.slug}`} class="preview-link">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul class="tag-list">
                      {article.tagList.map((tag, i) => (
                        <li key={i} class="tag-default tag-pill tag-outline">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </a>
                </div>
              ))}
            </ul>

            <ul class="pagination">
              {Array(Math.ceil(articles.articlesCount / 10))
                .fill(null)
                .map((_, i) =>
                  i == articleListStore.pageNumber - 1 ? (
                    <li class={`page-item active`} key={i}>
                      <a
                        class="page-link"
                        style="cursor: pointer;"
                        onClick$={() => {
                          console.log(`pagenunber=${articleListStore.pageNumber}`);
                          articleListStore.pageNumber = i + 1;
                          console.log(`newpagenunber=${articleListStore.pageNumber}`);
                        }}
                      >
                        {i + 1}
                      </a>
                    </li>
                  ) : (
                    <li class={`page-item`} key={i}>
                      <a
                        class="page-link"
                        style="cursor: pointer;"
                        onClick$={() => {
                          console.log(`pagenunber=${articleListStore.pageNumber}`);
                          articleListStore.pageNumber = i + 1;
                          console.log(`newpagenunber=${articleListStore.pageNumber}`);
                        }}
                      >
                        {i + 1}
                      </a>
                    </li>
                  )
                )}
            </ul>
          </>
        )}
      />
    </div>
  );
});
