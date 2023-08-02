import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import Comments from "~/components/comments/comments";
import type { ArticleData } from "~/models/article";
import { getArticle } from "~/services/article-service";

export default component$(() => {
  const slug = useLocation().params.slug;

  const article = useResource$<ArticleData>(({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    console.log("call article fetch");
    return getArticle(slug, controller);
  });

  return (
    <>
      <Resource
        value={article}
        onPending={() => <div>Loading Article...</div>}
        onRejected={(reason) => <div>Error: {reason}</div>}
        onResolved={(article) => (
          <div class="article-page">
            <div class="banner">
              <div class="container">
                <h1>{article.title}</h1>

                <div class="article-meta">
                  <a href={`/profile/${article.author.username}`}>
                    <img src={article.author.image} />
                  </a>
                  <div class="info">
                    <a href={`/profile/${article.author.username}`} class="author">
                      {article.author.username}
                    </a>
                    <span class="date">{article.createdAt}</span>
                  </div>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="ion-plus-round"></i>
                    &nbsp; Follow {article.author.username} <span class="counter"></span>
                  </button>
                  &nbsp;&nbsp;
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="ion-heart"></i>
                    &nbsp; Favorite Article <span class="counter">({article.favoritesCount})</span>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="ion-edit"></i> Edit Article
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="ion-trash-a"></i> Delete Article
                  </button>
                </div>
              </div>
            </div>

            <div class="container page">
              <div class="row article-content">
                <div class="col-md-12">
                  <p>{article.body}</p>

                  <ul class="tag-list">
                    {article.tagList.map((tag, i) => (
                      <li key={i} class="tag-default tag-pill tag-outline">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <hr />

              <div class="article-actions">
                <div class="article-meta">
                  <a href="profile.html">
                    <img src={article.author.image} />
                  </a>
                  <div class="info">
                    <a href="" class="author">
                      {article.author.username}
                    </a>
                    <span class="date">{article.createdAt}</span>
                  </div>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="ion-plus-round"></i>
                    &nbsp; Follow {article.author.username}
                  </button>
                  &nbsp;
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="ion-heart"></i>
                    &nbsp; Favorite Article <span class="counter">({article.favoritesCount})</span>
                  </button>
                  <button class="btn btn-sm btn-outline-secondary">
                    <i class="ion-edit"></i> Edit Article
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="ion-trash-a"></i> Delete Article
                  </button>
                </div>
              </div>
              <Comments slug={slug} />
            </div>
          </div>
        )}
      />
    </>
  );
});
