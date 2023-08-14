import { Resource, component$, useContext, useResource$, $ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import Comments from "~/components/comments/comments";
import type { ArticleData } from "~/models/article";
import { deleteArticle, getArticle } from "~/services/article-service";
import type { UserSessionStore } from "~/common/auth/auth-provider";
import { UserSessionContext } from "~/common/auth/auth-provider";

export default component$(() => {
  const userSession = useContext<UserSessionStore>(UserSessionContext);
  const slug = useLocation().params.slug;
  const navigate = useNavigate();

  const article = useResource$<ArticleData>(({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());
    console.log("call article fetch");
    return getArticle(slug, userSession.authToken, controller);
  });

  const onDeleteArticle = $(async () => {
    const response = await deleteArticle(userSession.authToken, slug);
    if (response.ok) navigate("/");
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
                  <Link href={`/profile/${article.author.username}`}>
                    <img src={article.author.image} />
                  </Link>
                  <div class="info">
                    <Link href={`/profile/${article.author.username}`} class="author">
                      {article.author.username}
                    </Link>
                    <span class="date">{article.createdAt}</span>
                  </div>
                  {userSession.username != article.author.username && (
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
                    >
                      <i class="ion-plus-round"></i>
                      &nbsp; Follow {article.author.username} <span class="counter"></span>
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {userSession.username != article.author.username && (
                    <button
                      class="btn btn-sm btn-outline-primary"
                      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
                    >
                      <i class="ion-heart"></i>
                      &nbsp; Favorite Article <span class="counter">({article.favoritesCount})</span>
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {userSession.username == article.author.username && (
                    <button class="btn btn-sm btn-outline-secondary" onClick$={() => navigate(`/editor/${slug}`)}>
                      <i class="ion-edit"></i> Edit Article
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {userSession.username == article.author.username && (
                    <button class="btn btn-sm btn-outline-danger" onClick$={onDeleteArticle}>
                      <i class="ion-trash-a"></i> Delete Article
                    </button>
                  )}
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
                  <Link href="profile.html">
                    <img src={article.author.image} />
                  </Link>
                  <div class="info">
                    <Link href="" class="author">
                      {article.author.username}
                    </Link>
                    <span class="date">{article.createdAt}</span>
                  </div>
                  {userSession.username != article.author.username && (
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
                    >
                      <i class="ion-plus-round"></i>
                      &nbsp; Follow {article.author.username} <span class="counter"></span>
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {userSession.username != article.author.username && (
                    <button
                      class="btn btn-sm btn-outline-primary"
                      onClick$={userSession.isLoggedIn ? $(() => {}) : $(() => navigate("/register"))}
                    >
                      <i class="ion-heart"></i>
                      &nbsp; Favorite Article <span class="counter">({article.favoritesCount})</span>
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {userSession.username == article.author.username && (
                    <button class="btn btn-sm btn-outline-secondary" onClick$={() => navigate(`/editor/${slug}`)}>
                      <i class="ion-edit"></i> Edit Article
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {userSession.username == article.author.username && (
                    <button class="btn btn-sm btn-outline-danger" onClick$={onDeleteArticle}>
                      <i class="ion-trash-a"></i> Delete Article
                    </button>
                  )}
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
