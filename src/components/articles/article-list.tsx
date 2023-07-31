import { Resource, component$, useResource$, useSignal } from "@builder.io/qwik";
import { BASE_URL } from "~/common/api";
import type { ArticlesDTO } from "~/models/article";

export async function getGlobalArticles(controller?: AbortController): Promise<ArticlesDTO> {
  console.log("FETCH", `${BASE_URL}/articles?limit=10&offset=0`);
  try {
    const response = await fetch(`${BASE_URL}/articles?limit=10&offset=0`, {
      signal: controller?.signal,
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    console.log("FETCH  articles resolved");
    return await response.json();
  } catch (e) {
    return Promise.reject("Error occurred while fetching data");
  }
}

export default component$(() => {
  const query = useSignal("busy");
  const articles = useResource$<ArticlesDTO>(({ track, cleanup }) => {
    // We need a way to re-run fetching data whenever the `github.org` changes.
    // Use `track` to trigger re-running of this data fetching function.
    track(() => query.value);

    // A good practice is to use `AbortController` to abort the fetching of data if
    // new request comes in. We create a new `AbortController` and register a `cleanup`
    // function which is called when this function re-runs.
    const controller = new AbortController();
    cleanup(() => controller.abort());

    // Fetch the data and return the promises.
    return getGlobalArticles(controller);
  });
  return (
    <Resource
      value={articles}
      onPending={() => <div>Loading Articles...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(articles) => (
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
      )}
    />
  );
});
