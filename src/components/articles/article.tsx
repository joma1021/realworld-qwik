import { component$ } from "@builder.io/qwik";
import type { ArticleData } from "~/models/article";

export const Article = component$((props: { article: ArticleData; key: string }) => {
  return (
    <div class="article-preview" key={props.key}>
      <div class="article-meta">
        <a href={`/profile/${props.article.author.username}`}>
          <img src={`${props.article.author.image}`} />
        </a>
        <div class="info">
          <a href={`/profile/${props.article.author.username}`} class="author">
            {props.article.author.username}
          </a>
          <span class="date">{props.article.createdAt}</span>
        </div>
        <button class="btn btn-outline-primary btn-sm pull-xs-right">
          <i class="ion-heart"></i> {props.article.favoritesCount}
        </button>
      </div>
      <a href={`/article/${props.article.slug}`} class="preview-link">
        <h1>{props.article.title}</h1>
        <p>{props.article.description}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          {props.article.tagList.map((tag) => (
            <li key={tag} class="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </div>
  );
});
